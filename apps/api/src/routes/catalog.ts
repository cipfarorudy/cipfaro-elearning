import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authRequired, requireRole } from "../lib/auth";

const router = Router();

router.get("/trainings", async (_req, res) => {
  const items = await prisma.training.findMany({ include: { sessions: true } });
  res.json(items);
});

router.post("/trainings", authRequired, requireRole("ADMIN"), async (req, res) => {
  const t = await prisma.training.create({ data: req.body });
  res.status(201).json(t);
});

router.get("/sessions", async (req, res) => {
  const trainingId = req.query.trainingId as string | undefined;
  const where = trainingId ? { trainingId } : {};
  const items = await prisma.session.findMany({ where });
  res.json(items);
});

export default router;
