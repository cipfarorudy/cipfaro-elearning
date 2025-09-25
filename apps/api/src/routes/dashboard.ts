import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth-middleware";

const router = Router();

router.get("/overview", requireAuth, async (req, res) => {
  try {
    const sessionId = String(req.query.sessionId || "");
    if (!sessionId) return res.status(400).json({ error: "sessionId requis" });

    // Utiliser des données simulées pour le développement
    const mockData = {
      learners: Math.floor(Math.random() * 50) + 10,
      modules: Math.floor(Math.random() * 8) + 3,
      completionRate: Math.floor(Math.random() * 40) + 60,
      averageScore: Math.floor(Math.random() * 30) + 70,
      totalAttendanceHours: Math.floor(Math.random() * 100) + 50,
      xapiCount: Math.floor(Math.random() * 200) + 100,
      attendanceByDay: [
        { date: "2024-09-16", hours: 7.5 },
        { date: "2024-09-17", hours: 8.0 },
        { date: "2024-09-18", hours: 6.5 },
        { date: "2024-09-19", hours: 7.0 },
        { date: "2024-09-20", hours: 8.5 },
      ],
    };

    res.json(mockData);
  } catch (error) {
    console.error("Erreur dashboard overview:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// Route pour les statistiques du dashboard
router.get("/stats", requireAuth, async (req, res) => {
  try {
    // Données simulées pour le développement
    const mockStats = {
      usersCount: Math.floor(Math.random() * 500) + 100,
      modulesCount: Math.floor(Math.random() * 50) + 20,
      sessionsCount: Math.floor(Math.random() * 30) + 10,
      recentUsers: Math.floor(Math.random() * 20) + 5,
      activeUsers: Math.floor(Math.random() * 80) + 40,
      completedModules: Math.floor(Math.random() * 200) + 50,
      recentSessions: Math.floor(Math.random() * 15) + 3,
      totalEnrollments: Math.floor(Math.random() * 1000) + 200,
      completedEnrollments: Math.floor(Math.random() * 500) + 100,
    };

    res.json(mockStats);
  } catch (error) {
    console.error("Erreur dashboard stats:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// Route pour l'activité récente
router.get("/recent-activity", requireAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    // Données simulées pour le développement
    const mockActivities = [
      {
        id: "1",
        action: "USER_LOGIN",
        details: { message: "Connexion réussie" },
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        user: {
          firstName: "Jean",
          lastName: "Dupont",
          email: "jean.dupont@example.com",
        },
      },
      {
        id: "2",
        action: "MODULE_COMPLETED",
        details: { moduleTitle: "Formation Sécurité" },
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        user: {
          firstName: "Marie",
          lastName: "Martin",
          email: "marie.martin@example.com",
        },
      },
      {
        id: "3",
        action: "USER_CREATED",
        details: { message: "Nouvel utilisateur créé" },
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        user: {
          firstName: "Admin",
          lastName: "System",
          email: "admin@cipfaro.fr",
        },
      },
    ].slice(0, limit);

    res.json(mockActivities);
  } catch (error) {
    console.error("Erreur dashboard recent-activity:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// Route pour les modules
router.get("/modules", requireAuth, async (req, res) => {
  try {
    // Données simulées pour le développement
    const mockModules = [
      {
        id: "1",
        title: "Formation Sécurité au Travail",
        description: "Module de formation sur la sécurité",
        duration: 120,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        enrollmentCount: Math.floor(Math.random() * 50) + 10,
        userProgress: Math.floor(Math.random() * 100),
        userCompleted: Math.random() > 0.5,
      },
      {
        id: "2",
        title: "Management et Leadership",
        description: "Développer ses compétences managériales",
        duration: 180,
        createdAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 14
        ).toISOString(),
        enrollmentCount: Math.floor(Math.random() * 30) + 5,
        userProgress: Math.floor(Math.random() * 100),
        userCompleted: Math.random() > 0.5,
      },
      {
        id: "3",
        title: "Communication Professionnelle",
        description: "Améliorer ses techniques de communication",
        duration: 90,
        createdAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 21
        ).toISOString(),
        enrollmentCount: Math.floor(Math.random() * 40) + 8,
        userProgress: Math.floor(Math.random() * 100),
        userCompleted: Math.random() > 0.5,
      },
    ];

    res.json(mockModules);
  } catch (error) {
    console.error("Erreur dashboard modules:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

export default router;
