"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = __importDefault(require("./routes/auth"));
const auth_enhanced_1 = __importDefault(require("./routes/auth-enhanced"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const catalog_1 = __importDefault(require("./routes/catalog"));
const scorm_1 = __importDefault(require("./routes/scorm"));
const xapi_1 = __importDefault(require("./routes/xapi"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const reports_1 = __importDefault(require("./routes/reports"));
const modules_1 = __importDefault(require("./routes/modules"));
const scorm_import_1 = __importDefault(require("./routes/scorm-import"));
function createServer() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
    app.use(express_1.default.json({ limit: "2mb" }));
    app.use((0, morgan_1.default)("dev"));
    app.get("/health", (_req, res) => res.json({ ok: true }));
    app.use("/auth", auth_1.default);
    app.use("/auth/v2", auth_enhanced_1.default); // Nouvelle API d'authentification
    app.use("/dashboard", dashboard_1.default); // API dashboard avec authentification
    app.use("/catalog", catalog_1.default);
    app.use("/scorm", scorm_1.default);
    app.use("/xapi", xapi_1.default);
    app.use("/attendance", attendance_1.default);
    app.use("/reports", reports_1.default);
    app.use("/modules", modules_1.default);
    app.use("/scorm", scorm_import_1.default);
    return app;
}
