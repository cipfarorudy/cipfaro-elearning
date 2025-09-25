import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import request from "supertest";
import express from "express";
import cors from "cors";
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

describe("API Integration Tests", () => {
  let app: express.Application;
  let testToken: string;

  beforeEach(async () => {
    // Initialiser l'application pour les tests
    app = express();
    app.use(cors());
    app.use(express.json());

    // Routes de test (simulation)
    app.post("/api/auth/login", (req, res) => {
      const { email, password } = req.body;
      if (email === "admin@test.com" && password === "test123") {
        testToken = "mock-jwt-token";
        res.json({
          token: testToken,
          user: mockUsers[0],
        });
      } else {
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

  describe("Authentication Flow", () => {
    it("should authenticate valid user credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "admin@test.com",
          password: "test123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe("admin@test.com");
    });

    it("should reject invalid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "admin@test.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });

    it("should require email and password", async () => {
      await request(app).post("/api/auth/login").send({}).expect(400);
    });
  });

  describe("Dashboard API", () => {
    it("should return dashboard data for authenticated user", async () => {
      // D'abord s'authentifier
      const authResponse = await request(app).post("/api/auth/login").send({
        email: "admin@test.com",
        password: "test123",
      });

      const token = authResponse.body.token;

      // Ensuite accéder au dashboard
      const response = await request(app)
        .get("/api/dashboard/overview")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty("stats");
      expect(response.body.stats).toHaveProperty("totalSessions");
      expect(response.body.stats).toHaveProperty("totalUsers");
      expect(response.body).toHaveProperty("recentActivity");
    });

    it("should reject unauthenticated requests", async () => {
      await request(app).get("/api/dashboard/overview").expect(401);
    });

    it("should reject invalid tokens", async () => {
      await request(app)
        .get("/api/dashboard/overview")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);
    });
  });

  describe("API Health & Reliability", () => {
    it("should respond to health checks", async () => {
      const response = await request(app).get("/api/health").expect(200);

      expect(response.body).toEqual({ ok: true });
    });

    it("should handle malformed JSON", async () => {
      await request(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send("invalid json")
        .expect(400);
    });

    it("should return 404 for unknown endpoints", async () => {
      await request(app).get("/api/unknown-endpoint").expect(404);
    });
  });
});
