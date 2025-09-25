"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
// Mock de l'application Express (sera remplacé par l'import réel)
const createTestApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Route de test simple
    app.get("/health", (req, res) => {
        res.json({ ok: true });
    });
    return app;
};
(0, globals_1.describe)("API Health Check", () => {
    let app;
    (0, globals_1.beforeEach)(() => {
        app = createTestApp();
    });
    (0, globals_1.it)("should return health status", async () => {
        const response = await (0, supertest_1.default)(app).get("/health").expect(200);
        (0, globals_1.expect)(response.body).toEqual({ ok: true });
    });
    (0, globals_1.it)("should handle 404 for unknown routes", async () => {
        await (0, supertest_1.default)(app).get("/unknown-route").expect(404);
    });
});
(0, globals_1.describe)("API Authentication", () => {
    (0, globals_1.it)("should validate JWT token format", () => {
        // Test de validation de format JWT
        const validJWTPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
        const testToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjaXBmYXJvIiwiaWF0IjoxNjk4NzY1NDMyLCJleHAiOjE2OTg4NTE4MzIsImF1ZCI6InVzZXJzIiwic3ViIjoidXNlckB0ZXN0LmNvbSJ9.signature";
        (0, globals_1.expect)(validJWTPattern.test(testToken)).toBe(true);
    });
    (0, globals_1.it)("should reject invalid JWT format", () => {
        const validJWTPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
        const invalidToken = "invalid.token";
        (0, globals_1.expect)(validJWTPattern.test(invalidToken)).toBe(false);
    });
});
