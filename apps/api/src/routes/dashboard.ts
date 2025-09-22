import { Router } from "express";
import { requireAuth, requireRole } from "../lib/auth-middleware";
import { prisma } from "../lib/prisma";

const router = Router();

// GET /dashboard/stats - Statistiques générales du dashboard
router.get("/stats", requireAuth, async (req, res) => {
  try {
    const user = req.user!;

    // Statistiques de base selon le rôle
    const baseStats = await prisma.$transaction(async (tx) => {
      const [usersCount, modulesCount, sessionsCount] = await Promise.all([
        tx.user.count({ where: { isActive: true } }),
        tx.module.count(),
        tx.session.count(),
      ]);

      return { usersCount, modulesCount, sessionsCount };
    });

    // Statistiques spécifiques selon le rôle
    let roleSpecificStats = {};

    switch (user.role) {
      case "ADMIN":
        roleSpecificStats = await getAdminStats();
        break;
      case "FORMATEUR":
        roleSpecificStats = await getFormateurStats(user.id);
        break;
      case "STAGIAIRE":
        roleSpecificStats = await getStagiaireStats(user.id);
        break;
      case "OPCO":
        roleSpecificStats = await getOpcoStats();
        break;
    }

    res.json({
      success: true,
      stats: {
        ...baseStats,
        ...roleSpecificStats,
      },
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({
      success: false,
      error: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    });
  }
});

// GET /dashboard/recent-activity - Activité récente
router.get("/recent-activity", requireAuth, async (req, res) => {
  try {
    const user = req.user!;
    const limit = parseInt(req.query.limit as string) || 10;

    let activities;

    if (user.role === "ADMIN") {
      // Les admins voient toute l'activité
      activities = await prisma.auditLog.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
      });
    } else {
      // Les autres voient uniquement leur activité
      activities = await prisma.auditLog.findMany({
        where: { userId: user.id },
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
      });
    }

    res.json({
      success: true,
      activities: activities.map((activity) => ({
        id: activity.id,
        action: activity.action,
        details: activity.details,
        createdAt: activity.createdAt,
        user: activity.user,
      })),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'activité:", error);
    res.status(500).json({
      success: false,
      error: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    });
  }
});

// GET /dashboard/modules - Modules selon le rôle
router.get("/modules", requireAuth, async (req, res) => {
  try {
    const user = req.user!;
    let modules;

    switch (user.role) {
      case "ADMIN":
        // Les admins voient tous les modules
        modules = await prisma.module.findMany({
          include: {
            _count: {
              select: { enrollments: true },
            },
          },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "FORMATEUR":
        // Les formateurs voient leurs modules
        modules = await prisma.module.findMany({
          where: { createdBy: user.id },
          include: {
            _count: {
              select: { enrollments: true },
            },
          },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "STAGIAIRE":
        // Les stagiaires voient leurs inscriptions
        modules = await prisma.module.findMany({
          where: {
            enrollments: {
              some: { userId: user.id },
            },
          },
          include: {
            _count: {
              select: { enrollments: true },
            },
            enrollments: {
              where: { userId: user.id },
              select: { progress: true, completedAt: true },
            },
          },
          orderBy: { createdAt: "desc" },
        });
        break;

      default:
        modules = [];
    }

    res.json({
      success: true,
      modules: modules.map((module) => ({
        id: module.id,
        title: module.title,
        description: module.description,
        duration: module.duration,
        createdAt: module.createdAt,
        enrollmentCount: module._count.enrollments,
        userProgress: module.enrollments?.[0]?.progress || 0,
        userCompleted: !!module.enrollments?.[0]?.completedAt,
      })),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des modules:", error);
    res.status(500).json({
      success: false,
      error: "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
    });
  }
});

// Fonctions utilitaires pour les statistiques par rôle
async function getAdminStats() {
  const [recentUsers, activeUsers, completedModules, recentSessions] =
    await Promise.all([
      prisma.user.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.user.count({
        where: {
          isActive: true,
          lastLoginAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.enrollment.count({
        where: { completedAt: { not: null } },
      }),
      prisma.session.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

  return {
    recentUsers,
    activeUsers,
    completedModules,
    recentSessions,
  };
}

async function getFormateurStats(userId: string) {
  const [myModules, totalEnrollments, completedEnrollments] = await Promise.all(
    [
      prisma.module.count({ where: { createdBy: userId } }),
      prisma.enrollment.count({
        where: { module: { createdBy: userId } },
      }),
      prisma.enrollment.count({
        where: {
          module: { createdBy: userId },
          completedAt: { not: null },
        },
      }),
    ]
  );

  return {
    myModules,
    totalEnrollments,
    completedEnrollments,
  };
}

async function getStagiaireStats(userId: string) {
  const [enrolledModules, completedModules, inProgressModules, totalProgress] =
    await Promise.all([
      prisma.enrollment.count({ where: { userId } }),
      prisma.enrollment.count({
        where: { userId, completedAt: { not: null } },
      }),
      prisma.enrollment.count({
        where: {
          userId,
          completedAt: null,
          progress: { gt: 0 },
        },
      }),
      prisma.enrollment.aggregate({
        where: { userId },
        _avg: { progress: true },
      }),
    ]);

  return {
    enrolledModules,
    completedModules,
    inProgressModules,
    averageProgress: Math.round(totalProgress._avg.progress || 0),
  };
}

async function getOpcoStats() {
  // Statistiques pour OPCO (organisme paritaire collecteur agréé)
  const [financedModules, totalLearners, completionRate] = await Promise.all([
    prisma.module.count(),
    prisma.user.count({ where: { role: "STAGIAIRE" } }),
    prisma.enrollment.aggregate({
      _avg: { progress: true },
    }),
  ]);

  return {
    financedModules,
    totalLearners,
    averageCompletionRate: Math.round(completionRate._avg.progress || 0),
  };
}

export default router;
