import express from "express";
import cors from "cors";

const app = express();
const port = 10002;

app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Gestion des erreurs
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Erreur serveur:", err);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, status: "API e-learning CIPFARO active" });
});

app.get("/catalog/trainings", (_req, res) => {
  res.json({
    formations: [
      {
        id: "1",
        title: "Introduction au SCORM",
        description: "Formation d'introduction aux standards SCORM",
        duration: "2 heures",
        modules: 5,
      },
      {
        id: "2",
        title: "Création de contenu e-learning",
        description: "Apprenez à créer du contenu e-learning interactif",
        duration: "4 heures",
        modules: 8,
      },
    ],
  });
});

app.post("/auth/demo", (_req, res) => {
  res.json({
    success: true,
    user: {
      id: "demo-user",
      email: "demo@cipfaro.com",
      role: "LEARNER",
    },
    token: "demo-token-123",
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(
    `🟢 Serveur de test e-learning CIPFARO actif sur http://localhost:${port}`
  );
  console.log("📚 Endpoints disponibles:");
  console.log("  - GET /health");
  console.log("  - GET /catalog/trainings");
  console.log("  - POST /auth/demo");
});

// Gestion propre des arrêts
process.on("SIGINT", () => {
  console.log("\n🔴 Arrêt du serveur...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🔴 Arrêt du serveur...");
  process.exit(0);
});
