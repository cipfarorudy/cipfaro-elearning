import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authRequired, requireRole } from "../lib/auth";
import { auditLog } from "../lib/audit";

const router = Router();

// GET /modules?sessionId=...
router.get("/", authRequired, async (req, res) => {
  const sessionId = req.query.sessionId as string | undefined;
  const where = sessionId ? { sessionId } : {};
  const items = await prisma.module.findMany({ where, include: { scorm: true } });
  res.json(items);
});

// POST /modules
router.post("/", authRequired, requireRole("ADMIN"), async (req, res) => {
  const { sessionId, title, type, orderIndex, expectedMinutes } = req.body;
  const mod = await prisma.module.create({ data: { sessionId, title, type, orderIndex, expectedMinutes } });
  await auditLog(req as any, "MODULE_CREATE", { moduleId: mod.id, sessionId: mod.sessionId, title });
  res.status(201).json(mod);
});

export default router;
