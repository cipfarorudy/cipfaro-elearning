import { Router } from "express";
import { prisma } from "../lib/prisma";
import { auditLog } from "../lib/audit";
import { authRequired } from "../lib/auth";

const router = Router();

// Commit SCORM 1.2 minimal
router.post("/:moduleId/commit", authRequired, async (req: any, res) => {
  const { moduleId } = req.params;
  const { lesson_status, score_raw, total_time, suspend_data } = req.body;

  // demo: enrollment unique per user-session (in real, lookup real enrollment)
  const enrollment = await prisma.enrollment.findFirst({ where: { userId: req.user.id } });
  if (!enrollment) return res.status(400).json({ error: "No enrollment" });

  await prisma.scormCmi.upsert({
    where: { enrollmentId_moduleId: { enrollmentId: enrollment.id, moduleId } },
    create: {
      enrollmentId: enrollment.id,
      moduleId,
      lessonStatus: lesson_status ?? null,
      scoreRaw: typeof score_raw === "number" ? score_raw : null,
      totalTime: total_time ?? null,
      suspendData: suspend_data ?? null
    },
    update: {
      lessonStatus: lesson_status ?? null,
      scoreRaw: typeof score_raw === "number" ? score_raw : null,
      totalTime: total_time ?? null,
      suspendData: suspend_data ?? null,
      lastCommit: new Date()
    }
  });
  await auditLog(req as any, "SCORM_COMMIT", { moduleId, lesson_status, score_raw, total_time });
  res.sendStatus(204);
});

export default router;
