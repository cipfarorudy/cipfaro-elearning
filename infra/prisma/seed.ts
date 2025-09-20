import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const [adminRole, formateurRole, stagiaireRole] = await Promise.all([
    prisma.role.upsert({ where: { code: "ADMIN" }, update: {}, create: { code: "ADMIN" } }),
    prisma.role.upsert({ where: { code: "FORMATEUR" }, update: {}, create: { code: "FORMATEUR" } }),
    prisma.role.upsert({ where: { code: "STAGIAIRE" }, update: {}, create: { code: "STAGIAIRE" } })
  ]);

  const hash = await bcrypt.hash("admin1234", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@cipfaro.local" },
    update: {},
    create: { email: "admin@cipfaro.local", passwordHash: hash, firstName: "Admin", lastName: "CIPFARO" }
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id }
  });

  const training = await prisma.training.create({
    data: {
      title: "Conseiller en Insertion Professionnelle (RNCP37274)",
      rncpCode: "RNCP37274",
      durationHours: 840,
      modality: "mixte",
      objectives: "Préparer au titre professionnel CIP.",
      prerequisites: "Niveau 4, appétence numérique."
    }
  });

  await prisma.session.create({
    data: {
      trainingId: training.id,
      title: "Promo CIP FARO — Janvier",
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180)
    }
  });
}

main().finally(() => prisma.$disconnect());
