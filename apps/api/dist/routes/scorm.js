"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const audit_1 = require("../lib/audit");
const auth_1 = require("../lib/auth");
const router = (0, express_1.Router)();
// Commit SCORM 1.2 minimal
router.post("/:moduleId/commit", auth_1.authRequired, async (req, res) => {
    const { moduleId } = req.params;
    const { lesson_status, score_raw, total_time, suspend_data } = req.body;
    // demo: enrollment unique per user-session (in real, lookup real enrollment)
    const enrollment = await prisma_1.prisma.enrollment.findFirst({ where: { userId: req.user.id } });
    if (!enrollment)
        return res.status(400).json({ error: "No enrollment" });
    await prisma_1.prisma.scormCmi.upsert({
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
    await (0, audit_1.auditLog)(req, "SCORM_COMMIT", { moduleId, lesson_status, score_raw, total_time });
    res.sendStatus(204);
});
exports.default = router;
