"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const audit_1 = require("../lib/audit");
const auth_1 = require("../lib/auth");
const router = (0, express_1.Router)();
router.post("/sign", auth_1.authRequired, async (req, res) => {
    const { enrollmentId, startTime, endTime, method, evidenceUrl } = req.body;
    const att = await prisma_1.prisma.attendance.create({
        data: {
            enrollmentId,
            date: new Date(startTime),
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            method: method ?? "signature",
            evidenceUrl: evidenceUrl ?? null
        }
    });
    await (0, audit_1.auditLog)(req, "ATTENDANCE_SIGN", { enrollmentId, startTime, endTime, method });
    res.status(201).json(att);
});
exports.default = router;
