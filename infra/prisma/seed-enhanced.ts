import { config } from 'dotenv';
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// Charger les variables d'environnement
config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding de la base de données...");

  // Nettoyer les données existantes
  await prisma.auditLog.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.module.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️ Données existantes supprimées");

  // Créer des utilisateurs de test avec mots de passe hashés
  const saltRounds = 12;

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@cipfaro.fr",
      password: await bcrypt.hash("admin123", saltRounds),
      firstName: "Admin",
      lastName: "CIPFARO",
      role: "ADMIN",
      isActive: true,
      lastLoginAt: new Date(),
    },
  });

  const formateurUser = await prisma.user.create({
    data: {
      email: "formateur@cipfaro.fr",
      password: await bcrypt.hash("formateur123", saltRounds),
      firstName: "Jean",
      lastName: "MARTIN",
      role: "FORMATEUR",
      isActive: true,
      lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // il y a 1 jour
    },
  });

  const stagiaireUser = await prisma.user.create({
    data: {
      email: "stagiaire@cipfaro.fr",
      password: await bcrypt.hash("stagiaire123", saltRounds),
      firstName: "Marie",
      lastName: "DUPONT",
      role: "STAGIAIRE",
      isActive: true,
      lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // il y a 2 heures
    },
  });

  const opcoUser = await prisma.user.create({
    data: {
      email: "opco@cipfaro.fr",
      password: await bcrypt.hash("opco123", saltRounds),
      firstName: "Pierre",
      lastName: "BERNARD",
      role: "OPCO",
      isActive: true,
      lastLoginAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // il y a 6 heures
    },
  });

  // Créer des utilisateurs supplémentaires
  const stagiaires = await Promise.all([
    prisma.user.create({
      data: {
        email: "alice.robert@example.com",
        password: await bcrypt.hash("password123", saltRounds),
        firstName: "Alice",
        lastName: "ROBERT",
        role: "STAGIAIRE",
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "bob.wilson@example.com",
        password: await bcrypt.hash("password123", saltRounds),
        firstName: "Bob",
        lastName: "WILSON",
        role: "STAGIAIRE",
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "claire.brown@example.com",
        password: await bcrypt.hash("password123", saltRounds),
        firstName: "Claire",
        lastName: "BROWN",
        role: "STAGIAIRE",
        isActive: false, // Utilisateur inactif
      },
    }),
  ]);

  console.log("👥 Utilisateurs créés:", {
    admin: adminUser.email,
    formateur: formateurUser.email,
    stagiaire: stagiaireUser.email,
    opco: opcoUser.email,
    stagiairesSupp: stagiaires.length,
  });

  // Créer des modules de formation
  const modules = await Promise.all([
    prisma.module.create({
      data: {
        title: "Sécurité au Travail - Niveau 1",
        description:
          "Formation fondamentale sur les règles de sécurité en entreprise",
        content: JSON.stringify({
          type: "scorm",
          duration: 120,
          lessons: [
            { title: "Introduction à la sécurité", duration: 30 },
            { title: "Équipements de protection", duration: 45 },
            { title: "Procédures d'urgence", duration: 45 },
          ],
        }),
        duration: 120,
        createdBy: formateurUser.id,
      },
    }),
    prisma.module.create({
      data: {
        title: "Communication Professionnelle",
        description:
          "Améliorer ses compétences de communication en milieu professionnel",
        content: JSON.stringify({
          type: "scorm",
          duration: 180,
          lessons: [
            { title: "Bases de la communication", duration: 60 },
            { title: "Communication écrite", duration: 60 },
            { title: "Présentation orale", duration: 60 },
          ],
        }),
        duration: 180,
        createdBy: formateurUser.id,
      },
    }),
    prisma.module.create({
      data: {
        title: "Gestion de Projet Agile",
        description: "Méthodologies agiles pour la gestion de projet moderne",
        content: JSON.stringify({
          type: "scorm",
          duration: 240,
          lessons: [
            { title: "Introduction à l'agilité", duration: 60 },
            { title: "Scrum Framework", duration: 90 },
            { title: "Kanban et outils", duration: 90 },
          ],
        }),
        duration: 240,
        createdBy: adminUser.id,
      },
    }),
    prisma.module.create({
      data: {
        title: "Bureautique Avancée",
        description: "Maîtrise avancée des outils bureautiques",
        content: JSON.stringify({
          type: "scorm",
          duration: 300,
          lessons: [
            { title: "Excel avancé", duration: 120 },
            { title: "PowerPoint professionnel", duration: 90 },
            { title: "Word automatisation", duration: 90 },
          ],
        }),
        duration: 300,
        createdBy: formateurUser.id,
      },
    }),
  ]);

  console.log(
    "📚 Modules créés:",
    modules.map((m) => m.title)
  );

  // Créer des inscriptions (enrollments)
  const enrollments = await Promise.all([
    // Stagiaire principal inscrit à tous les modules
    ...modules.map((module, index) =>
      prisma.enrollment.create({
        data: {
          userId: stagiaireUser.id,
          moduleId: module.id,
          progress: [85, 65, 45, 20][index] || 0, // Progressions variées
          completedAt:
            index < 2
              ? new Date(Date.now() - (7 - index) * 24 * 60 * 60 * 1000)
              : null,
        },
      })
    ),
    // Alice inscrite à 2 modules
    prisma.enrollment.create({
      data: {
        userId: stagiaires[0].id,
        moduleId: modules[0].id,
        progress: 100,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.enrollment.create({
      data: {
        userId: stagiaires[0].id,
        moduleId: modules[1].id,
        progress: 75,
        completedAt: null,
      },
    }),
    // Bob inscrit à 1 module
    prisma.enrollment.create({
      data: {
        userId: stagiaires[1].id,
        moduleId: modules[2].id,
        progress: 30,
        completedAt: null,
      },
    }),
  ]);

  console.log("📝 Inscriptions créées:", enrollments.length);

  // Créer des sessions de formation
  const sessions = await Promise.all([
    prisma.session.create({
      data: {
        title: "Session Sécurité - Groupe A",
        description:
          "Session de formation en présentiel pour le module sécurité",
        startDate: new Date("2024-01-15T09:00:00Z"),
        endDate: new Date("2024-01-15T12:00:00Z"),
        moduleId: modules[0].id,
        instructorId: formateurUser.id,
        maxParticipants: 20,
      },
    }),
    prisma.session.create({
      data: {
        title: "Atelier Communication",
        description: "Atelier pratique de communication professionnelle",
        startDate: new Date("2024-01-20T14:00:00Z"),
        endDate: new Date("2024-01-20T17:00:00Z"),
        moduleId: modules[1].id,
        instructorId: formateurUser.id,
        maxParticipants: 15,
      },
    }),
    prisma.session.create({
      data: {
        title: "Formation Agile - Certification",
        description: "Formation intensive sur les méthodologies agiles",
        startDate: new Date("2024-01-25T09:00:00Z"),
        endDate: new Date("2024-01-26T17:00:00Z"),
        moduleId: modules[2].id,
        instructorId: adminUser.id,
        maxParticipants: 12,
      },
    }),
  ]);

  console.log(
    "📅 Sessions créées:",
    sessions.map((s) => s.title)
  );

  // Créer des logs d'audit pour simuler l'activité
  const auditLogs = await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        action: "LOGIN_SUCCESS",
        details: { ip: "192.168.1.100", userAgent: "Mozilla/5.0" },
        createdAt: new Date(Date.now() - 10 * 60 * 1000), // il y a 10 minutes
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: stagiaireUser.id,
        action: "MODULE_STARTED",
        details: { moduleId: modules[2].id, moduleTitle: modules[2].title },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // il y a 2 heures
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: stagiaires[0].id,
        action: "MODULE_COMPLETED",
        details: { moduleId: modules[0].id, moduleTitle: modules[0].title },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // il y a 3 jours
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: formateurUser.id,
        action: "USER_CREATED",
        details: {
          newUserId: stagiaires[1].id,
          newUserEmail: stagiaires[1].email,
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // il y a 5 jours
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: opcoUser.id,
        action: "LOGIN_SUCCESS",
        details: { ip: "192.168.1.50", userAgent: "Mozilla/5.0" },
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // il y a 6 heures
      },
    }),
  ]);

  console.log("📋 Logs d'audit créés:", auditLogs.length);

  console.log("✅ Seeding terminé avec succès !");
  console.log("\n📋 Résumé:");
  console.log(
    `👥 Utilisateurs: ${7} (1 admin, 1 formateur, 4 stagiaires, 1 OPCO)`
  );
  console.log(`📚 Modules: ${modules.length}`);
  console.log(`📝 Inscriptions: ${enrollments.length}`);
  console.log(`📅 Sessions: ${sessions.length}`);
  console.log(`📋 Logs d'audit: ${auditLogs.length}`);

  console.log("\n🔑 Comptes de test:");
  console.log("Admin: admin@cipfaro.fr / admin123");
  console.log("Formateur: formateur@cipfaro.fr / formateur123");
  console.log("Stagiaire: stagiaire@cipfaro.fr / stagiaire123");
  console.log("OPCO: opco@cipfaro.fr / opco123");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
