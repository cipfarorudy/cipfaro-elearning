import client from "prom-client";

// Créer un registre pour les métriques
const register = new client.Registry();

// Collecter les métriques par défaut de Node.js
client.collectDefaultMetrics({ register });

// Métriques personnalisées pour l'API
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

const httpRequestTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const activeUsers = new client.Gauge({
  name: "active_users_total",
  help: "Number of active users",
});

const scormModulesTotal = new client.Gauge({
  name: "scorm_modules_total",
  help: "Total number of SCORM modules",
});

// Enregistrer les métriques
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeUsers);
register.registerMetric(scormModulesTotal);

// Middleware pour mesurer les requêtes HTTP
export const metricsMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path || "unknown";

    httpRequestDuration
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration);

    httpRequestTotal.labels(req.method, route, res.statusCode.toString()).inc();
  });

  next();
};

// Handler pour exposer les métriques
export const metricsHandler = async (req: any, res: any) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
};

// Fonctions utilitaires pour mettre à jour les métriques
export const updateActiveUsers = (count: number) => {
  activeUsers.set(count);
};

export const updateScormModulesCount = (count: number) => {
  scormModulesTotal.set(count);
};

export default register;
