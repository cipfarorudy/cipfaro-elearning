import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// Charger les variables d'environnement
config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding de la base de données...");

  // Nettoyer les données existantes
  await prisma.auditLog.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.training.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log("🗑️ Données existantes supprimées");

  // Créer les rôles de base
  const roles = await Promise.all([
    prisma.role.create({ data: { code: "ADMIN" } }),
    prisma.role.create({ data: { code: "FORMATEUR" } }),
    prisma.role.create({ data: { code: "STAGIAIRE" } }),
    prisma.role.create({ data: { code: "OPCO" } }),
  ]);

  console.log(
    "🛡️ Rôles créés:",
    roles.map((r) => r.code)
  );

  // Créer des utilisateurs de test avec mots de passe hashés
  const saltRounds = 12;

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@cipfaro.fr",
      passwordHash: await bcrypt.hash("admin123", saltRounds),
      firstName: "Admin",
      lastName: "CIPFARO",
      isActive: true,
    },
  });

  const formateurUser = await prisma.user.create({
    data: {
      email: "formateur@cipfaro.fr",
      passwordHash: await bcrypt.hash("formateur123", saltRounds),
      firstName: "Jean",
      lastName: "MARTIN",
      isActive: true,
    },
  });

  const stagiaireUser = await prisma.user.create({
    data: {
      email: "stagiaire@cipfaro.fr",
      passwordHash: await bcrypt.hash("stagiaire123", saltRounds),
      firstName: "Marie",
      lastName: "DUPONT",
      isActive: true,
    },
  });

  const opcoUser = await prisma.user.create({
    data: {
      email: "opco@cipfaro.fr",
      passwordHash: await bcrypt.hash("opco123", saltRounds),
      firstName: "Pierre",
      lastName: "BERNARD",
      isActive: true,
    },
  });

  console.log("👥 Utilisateurs créés");

  // Assigner les rôles aux utilisateurs
  await Promise.all([
    prisma.userRole.create({
      data: {
        userId: adminUser.id,
        roleId: roles.find((r) => r.code === "ADMIN")!.id,
      },
    }),
    prisma.userRole.create({
      data: {
        userId: formateurUser.id,
        roleId: roles.find((r) => r.code === "FORMATEUR")!.id,
      },
    }),
    prisma.userRole.create({
      data: {
        userId: stagiaireUser.id,
        roleId: roles.find((r) => r.code === "STAGIAIRE")!.id,
      },
    }),
    prisma.userRole.create({
      data: {
        userId: opcoUser.id,
        roleId: roles.find((r) => r.code === "OPCO")!.id,
      },
    }),
  ]);

  console.log("🔗 Rôles assignés aux utilisateurs");

  // Créer des formations de test
  const trainings = await Promise.all([
    prisma.training.create({
      data: {
        title: "Sécurité au Travail - Niveau 1",
        rncpCode: "RNCP001",
        objectives:
          "Formation fondamentale sur les règles de sécurité en entreprise",
        prerequisites: "Aucun prérequis",
        durationHours: 7,
        modality: "presentiel",
      },
    }),
    prisma.training.create({
      data: {
        title: "Communication Professionnelle",
        rncpCode: "RNCP002",
        objectives:
          "Améliorer ses compétences de communication en milieu professionnel",
        prerequisites: "Niveau français B2",
        durationHours: 14,
        modality: "mixte",
      },
    }),
    prisma.training.create({
      data: {
        title: "Gestion de Projet Agile",
        rncpCode: "RNCP003",
        objectives: "Méthodologies agiles pour la gestion de projet moderne",
        prerequisites: "Expérience en gestion de projet",
        durationHours: 21,
        modality: "distanciel",
      },
    }),
  ]);

  console.log(
    "📚 Formations créées:",
    trainings.map((t) => t.title)
  );

  // Créer des sessions de formation
  const sessions = await Promise.all([
    prisma.session.create({
      data: {
        startDate: new Date("2024-02-15T09:00:00Z"),
        endDate: new Date("2024-02-15T16:00:00Z"),
        location: "Salle A - CIPFARO",
        capacity: 20,
        trainingId: trainings[0].id,
      },
    }),
    prisma.session.create({
      data: {
        startDate: new Date("2024-02-20T14:00:00Z"),
        endDate: new Date("2024-02-22T17:00:00Z"),
        location: "Salle B - CIPFARO",
        capacity: 15,
        trainingId: trainings[1].id,
      },
    }),
    prisma.session.create({
      data: {
        startDate: new Date("2024-02-25T09:00:00Z"),
        endDate: new Date("2024-02-27T17:00:00Z"),
        location: "Formation en ligne",
        capacity: 25,
        trainingId: trainings[2].id,
      },
    }),
  ]);

  console.log("📅 Sessions créées:", sessions.length);

  // Créer des inscriptions
  await Promise.all([
    prisma.enrollment.create({
      data: {
        userId: stagiaireUser.id,
        sessionId: sessions[0].id,
      },
    }),
    prisma.enrollment.create({
      data: {
        userId: stagiaireUser.id,
        sessionId: sessions[1].id,
      },
    }),
  ]);

  console.log("📝 Inscriptions créées");

  // Créer des logs d'audit pour simuler l'activité
  await Promise.all([
    prisma.auditLog.create({
      data: {
        event: "USER_LOGIN",
        userId: adminUser.id,
        ip: "192.168.1.100",
        meta: { userAgent: "Mozilla/5.0" },
      },
    }),
    prisma.auditLog.create({
      data: {
        event: "TRAINING_CREATED",
        userId: formateurUser.id,
        meta: { trainingTitle: trainings[0].title },
      },
    }),
    prisma.auditLog.create({
      data: {
        event: "ENROLLMENT_CREATED",
        userId: stagiaireUser.id,
        sessionId: sessions[0].id,
        meta: { sessionTitle: "Session Sécurité - Groupe A" },
      },
    }),
  ]);

  console.log("📋 Logs d'audit créés");

  console.log("✅ Seeding terminé avec succès !");
  console.log("\n📋 Résumé:");
  console.log(`🛡️ Rôles: ${roles.length}`);
  console.log(`👥 Utilisateurs: 4 (1 admin, 1 formateur, 1 stagiaire, 1 OPCO)`);
  console.log(`📚 Formations: ${trainings.length}`);
  console.log(`📅 Sessions: ${sessions.length}`);

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
