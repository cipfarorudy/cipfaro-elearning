"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import { createApp } from '../server.js'; // TODO: À ajuster selon la structure
// Mock des données pour les tests d'intégration
const mockUsers = [
    {
        id: "1",
        email: "admin@test.com",
        firstName: "Admin",
        lastName: "Test",
        roles: [{ code: "ADMIN" }],
    },
    {
        id: "2",
        email: "formateur@test.com",
        firstName: "Formateur",
        lastName: "Test",
        roles: [{ code: "FORMATEUR" }],
    },
];
const mockSessions = [
    {
        id: "session-1",
        training: { title: "Formation Test" },
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-31"),
        enrollments: mockUsers.map((user) => ({ userId: user.id })),
    },
];
(0, globals_1.describe)("API Integration Tests", () => {
    let app;
    let testToken;
    (0, globals_1.beforeEach)(async () => {
        // Initialiser l'application pour les tests
        app = (0, express_1.default)();
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        // Routes de test (simulation)
        app.post("/api/auth/login", (req, res) => {
            const { email, password } = req.body;
            if (email === "admin@test.com" && password === "test123") {
                testToken = "mock-jwt-token";
                res.json({
                    token: testToken,
                    user: mockUsers[0],
                });
            }
            else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        });
        app.get("/api/dashboard/overview", (req, res) => {
            const auth = req.headers.authorization;
            if (!auth || !auth.startsWith("Bearer ")) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            res.json({
                stats: {
                    totalSessions: mockSessions.length,
                    totalUsers: mockUsers.length,
                    activeSessions: 1,
                    completedModules: 5,
                },
                recentActivity: [
                    {
                        type: "login",
                        user: "Admin Test",
                        timestamp: new Date().toISOString(),
                    },
                ],
            });
        });
        app.get("/api/health", (req, res) => {
            res.json({ ok: true });
        });
    });
    (0, globals_1.describe)("Authentication Flow", () => {
        (0, globals_1.it)("should authenticate valid user credentials", async () => {
            const response = await (0, supertest_1.default)(app)
                .post("/api/auth/login")
                .send({
                email: "admin@test.com",
                password: "test123",
            })
                .expect(200);
            (0, globals_1.expect)(response.body).toHaveProperty("token");
            (0, globals_1.expect)(response.body).toHaveProperty("user");
            (0, globals_1.expect)(response.body.user.email).toBe("admin@test.com");
        });
        (0, globals_1.it)("should reject invalid credentials", async () => {
            const response = await (0, supertest_1.default)(app)
                .post("/api/auth/login")
                .send({
                email: "admin@test.com",
                password: "wrongpassword",
            })
                .expect(401);
            (0, globals_1.expect)(response.body).toHaveProperty("error");
        });
        (0, globals_1.it)("should require email and password", async () => {
            await (0, supertest_1.default)(app).post("/api/auth/login").send({}).expect(400);
        });
    });
    (0, globals_1.describe)("Dashboard API", () => {
        (0, globals_1.it)("should return dashboard data for authenticated user", async () => {
            // D'abord s'authentifier
            const authResponse = await (0, supertest_1.default)(app).post("/api/auth/login").send({
                email: "admin@test.com",
                password: "test123",
            });
            const token = authResponse.body.token;
            // Ensuite accéder au dashboard
            const response = await (0, supertest_1.default)(app)
                .get("/api/dashboard/overview")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            (0, globals_1.expect)(response.body).toHaveProperty("stats");
            (0, globals_1.expect)(response.body.stats).toHaveProperty("totalSessions");
            (0, globals_1.expect)(response.body.stats).toHaveProperty("totalUsers");
            (0, globals_1.expect)(response.body).toHaveProperty("recentActivity");
        });
        (0, globals_1.it)("should reject unauthenticated requests", async () => {
            await (0, supertest_1.default)(app).get("/api/dashboard/overview").expect(401);
        });
        (0, globals_1.it)("should reject invalid tokens", async () => {
            await (0, supertest_1.default)(app)
                .get("/api/dashboard/overview")
                .set("Authorization", "Bearer invalid-token")
                .expect(401);
        });
    });
    (0, globals_1.describe)("API Health & Reliability", () => {
        (0, globals_1.it)("should respond to health checks", async () => {
            const response = await (0, supertest_1.default)(app).get("/api/health").expect(200);
            (0, globals_1.expect)(response.body).toEqual({ ok: true });
        });
        (0, globals_1.it)("should handle malformed JSON", async () => {
            await (0, supertest_1.default)(app)
                .post("/api/auth/login")
                .set("Content-Type", "application/json")
                .send("invalid json")
                .expect(400);
        });
        (0, globals_1.it)("should return 404 for unknown endpoints", async () => {
            await (0, supertest_1.default)(app).get("/api/unknown-endpoint").expect(404);
        });
    });
});
