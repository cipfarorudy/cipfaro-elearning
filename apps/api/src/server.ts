import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import catalogRoutes from "./routes/catalog";
import scormRoutes from "./routes/scorm";
import xapiRoutes from "./routes/xapi";
import attendanceRoutes from "./routes/attendance";
import reportsRoutes from "./routes/reports";
import modulesRoutes from "./routes/modules";
import scormImportRoutes from "./routes/scorm-import";

export function createServer() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/auth", authRoutes);
  app.use("/catalog", catalogRoutes);
  app.use("/scorm", scormRoutes);
  app.use("/xapi", xapiRoutes);
  app.use("/attendance", attendanceRoutes);
  app.use("/reports", reportsRoutes);
  app.use("/modules", modulesRoutes);
  app.use("/scorm", scormImportRoutes);

  return app;
}
