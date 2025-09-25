"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../lib/auth");
const router = (0, express_1.Router)();
router.get("/trainings", async (_req, res) => {
    const items = await prisma_1.prisma.training.findMany({ include: { sessions: true } });
    res.json(items);
});
router.post("/trainings", auth_1.authRequired, (0, auth_1.requireRole)("ADMIN"), async (req, res) => {
    const t = await prisma_1.prisma.training.create({ data: req.body });
    res.status(201).json(t);
});
router.get("/sessions", async (req, res) => {
    const trainingId = req.query.trainingId;
    const where = trainingId ? { trainingId } : {};
    const items = await prisma_1.prisma.session.findMany({ where });
    res.json(items);
});
exports.default = router;
