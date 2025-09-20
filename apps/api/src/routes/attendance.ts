import { Router } from "express";
import { prisma } from "../lib/prisma";
import { auditLog } from "../lib/audit";
import { authRequired } from "../lib/auth";

const router = Router();

router.post("/sign", authRequired, async (req: any, res) => {
  const { enrollmentId, startTime, endTime, method, evidenceUrl } = req.body;
  const att = await prisma.attendance.create({
    data: {
      enrollmentId,
      date: new Date(startTime),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      method: method ?? "signature",
      evidenceUrl: evidenceUrl ?? null
    }
  });
  await auditLog(req as any, "ATTENDANCE_SIGN", { enrollmentId, startTime, endTime, method });
  res.status(201).json(att);
});

export default router;
