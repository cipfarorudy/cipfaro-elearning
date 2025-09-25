"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../lib/auth-middleware");
const router = (0, express_1.Router)();
router.get("/overview", auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const sessionId = String(req.query.sessionId || "");
        if (!sessionId)
            return res.status(400).json({ error: "sessionId requis" });
        // Utiliser des données simulées pour le développement
        const mockData = {
            learners: Math.floor(Math.random() * 50) + 10,
            modules: Math.floor(Math.random() * 8) + 3,
            completionRate: Math.floor(Math.random() * 40) + 60,
            averageScore: Math.floor(Math.random() * 30) + 70,
            totalAttendanceHours: Math.floor(Math.random() * 100) + 50,
            xapiCount: Math.floor(Math.random() * 200) + 100,
            attendanceByDay: [
                { date: "2024-09-16", hours: 7.5 },
                { date: "2024-09-17", hours: 8.0 },
                { date: "2024-09-18", hours: 6.5 },
                { date: "2024-09-19", hours: 7.0 },
                { date: "2024-09-20", hours: 8.5 },
            ],
        };
        res.json(mockData);
    }
    catch (error) {
        console.error("Erreur dashboard overview:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});
exports.default = router;
