"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../lib/auth");
const audit_1 = require("../lib/audit");
const router = (0, express_1.Router)();
// GET /modules?sessionId=...
router.get("/", auth_1.authRequired, async (req, res) => {
    const sessionId = req.query.sessionId;
    const where = sessionId ? { sessionId } : {};
    const items = await prisma_1.prisma.module.findMany({ where, include: { scorm: true } });
    res.json(items);
});
// POST /modules
router.post("/", auth_1.authRequired, (0, auth_1.requireRole)("ADMIN"), async (req, res) => {
    const { sessionId, title, type, orderIndex, expectedMinutes } = req.body;
    const mod = await prisma_1.prisma.module.create({ data: { sessionId, title, type, orderIndex, expectedMinutes } });
    await (0, audit_1.auditLog)(req, "MODULE_CREATE", { moduleId: mod.id, sessionId: mod.sessionId, title });
    res.status(201).json(mod);
});
exports.default = router;
