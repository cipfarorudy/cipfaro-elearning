"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../lib/auth");
const crypto_1 = __importDefault(require("crypto"));
const pdf_1 = require("../lib/pdf");
const ejs_1 = __importDefault(require("ejs"));
const qrcode_1 = __importDefault(require("qrcode"));
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/fr");
dayjs_1.default.locale("fr");
const router = (0, express_1.Router)();
function csvEscape(v) {
    if (v === null || v === undefined)
        return "";
    const s = String(v);
    if (/[",\n]/.test(s))
        return '"' + s.replace(/"/g, '""') + '"';
    return s;
}
router.get("/attendance.csv", auth_1.authRequired, (0, auth_1.requireRole)("ADMIN", "FORMATEUR"), async (req, res) => {
    const sessionId = String(req.query.sessionId || "");
    if (!sessionId)
        return res.status(400).json({ error: "sessionId requis" });
    const session = await prisma_1.prisma.session.findUnique({
        where: { id: sessionId },
        include: {
            training: true,
            enrollments: { include: { user: true, attendance: true } },
        },
    });
    if (!session)
        return res.status(404).json({ error: "Session introuvable" });
    const rows = [
        [
            "date",
            "start_time",
            "end_time",
            "learner_name",
            "email",
            "session_title",
            "training_title",
            "method",
            "evidence_url",
            "enrollment_id",
        ],
    ];
    for (const enr of session.enrollments) {
        for (const att of enr.attendance) {
            rows.push([
                (0, dayjs_1.default)(att.date).format("YYYY-MM-DD"),
                (0, dayjs_1.default)(att.startTime).format("HH:mm"),
                (0, dayjs_1.default)(att.endTime).format("HH:mm"),
                `${enr.user.firstName || ""} ${enr.user.lastName || ""}`.trim(),
                enr.user.email,
                session.title,
                session.training.title,
                att.method,
                att.evidenceUrl || "",
                enr.id,
            ]);
        }
    }
    const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
    const hash = crypto_1.default.createHash("sha256").update(csv).digest("hex");
    const signedCsv = csv + "\n# sha256=" + hash + "\n";
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="attendance_${sessionId}.csv"`);
    res.setHeader("X-Data-Hash", hash);
    res.send("\ufeff" + signedCsv);
});
router.get("/attendance.pdf", auth_1.authRequired, (0, auth_1.requireRole)("ADMIN", "FORMATEUR"), async (req, res) => {
    const sessionId = String(req.query.sessionId || "");
    if (!sessionId)
        return res.status(400).json({ error: "sessionId requis" });
    const session = await prisma_1.prisma.session.findUnique({
        where: { id: sessionId },
        include: {
            training: true,
            enrollments: { include: { user: true, attendance: true } },
        },
    });
    if (!session)
        return res.status(404).json({ error: "Session introuvable" });
    const rows = [];
    for (const enr of session.enrollments) {
        for (const att of enr.attendance) {
            rows.push({
                date: (0, dayjs_1.default)(att.date).format("DD/MM/YYYY"),
                start: (0, dayjs_1.default)(att.startTime).format("HH:mm"),
                end: (0, dayjs_1.default)(att.endTime).format("HH:mm"),
                learner: `${enr.user.firstName || ""} ${enr.user.lastName || ""}`.trim() ||
                    enr.user.email,
                email: enr.user.email,
                method: att.method,
                evidenceUrl: att.evidenceUrl || "",
                enrollmentId: enr.id,
            });
        }
    }
    const payload = JSON.stringify({ sessionId, rows });
    const hash = crypto_1.default.createHash("sha256").update(payload).digest("hex");
    const qr = await qrcode_1.default.toDataURL("sha256:" + hash);
    const html = await ejs_1.default.renderFile(__dirname + "/../templates/attendance.ejs", {
        session,
        rows,
        hash,
        qr,
        dayjs: dayjs_1.default,
    });
    const pdf = await (0, pdf_1.htmlToPdfBuffer)(html);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="attendance_${sessionId}.pdf"`);
    res.setHeader("X-Data-Hash", hash);
    res.send(pdf);
});
router.get("/attestation/:enrollmentId.pdf", auth_1.authRequired, (0, auth_1.requireRole)("ADMIN", "FORMATEUR"), async (req, res) => {
    const enrollmentId = String(req.params.enrollmentId || "");
    const enr = await prisma_1.prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: {
            user: true,
            session: { include: { training: true, modules: true } },
        },
    });
    if (!enr)
        return res.status(404).json({ error: "Enrollment introuvable" });
    const cmi = await prisma_1.prisma.scormCmi.findMany({ where: { enrollmentId } });
    const totalModules = enr.session.modules.length || 1;
    const completed = cmi.filter((x) => (x.lessonStatus || "").match(/completed|passed/i)).length;
    const progressPct = Math.round((completed / totalModules) * 100);
    const today = (0, dayjs_1.default)().format("DD/MM/YYYY");
    const hash = crypto_1.default
        .createHash("sha256")
        .update(JSON.stringify({ enrollmentId, progressPct }))
        .digest("hex");
    const qr = await qrcode_1.default.toDataURL("sha256:" + hash);
    const html = await ejs_1.default.renderFile(__dirname + "/../templates/attestation.ejs", {
        user: enr.user,
        session: enr.session,
        training: enr.session.training,
        progressPct,
        today,
        hash,
        qr,
        dayjs: dayjs_1.default,
    });
    const pdf = await (0, pdf_1.htmlToPdfBuffer)(html);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="attestation_${enrollmentId}.pdf"`);
    res.setHeader("X-Data-Hash", hash);
    res.send(pdf);
});
exports.default = router;
const archiver_1 = __importDefault(require("archiver"));
router.get("/audit.csv", auth_1.authRequired, (0, auth_1.requireRole)("ADMIN"), async (req, res) => {
    const { userId, sessionId, event, from, to } = req.query;
    const where = {};
    if (userId)
        where.userId = userId;
    if (sessionId)
        where.sessionId = sessionId;
    if (event)
        where.event = String(event);
    if (from || to) {
        where.createdAt = {};
        if (from)
            where.createdAt.gte = new Date(from);
        if (to)
            where.createdAt.lte = new Date(to);
    }
    const logs = await prisma_1.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });
    const header = [
        "createdAt",
        "event",
        "userId",
        "sessionId",
        "enrollmentId",
        "moduleId",
        "ip",
        "meta",
    ];
    const rows = [header];
    for (const l of logs) {
        rows.push([
            l.createdAt.toISOString(),
            l.event,
            l.userId || "",
            l.sessionId || "",
            l.enrollmentId || "",
            l.moduleId || "",
            l.ip || "",
            l.meta ? JSON.stringify(l.meta) : "",
        ]);
    }
    function csvEscape(v) {
        if (v === null || v === undefined)
            return "";
        const s = String(v);
        if (/[",\n]/.test(s))
            return '"' + s.replace(/"/g, '""') + '"';
        return s;
    }
    const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
    const crypto = await Promise.resolve().then(() => __importStar(require("crypto")));
    const hash = crypto.createHash("sha256").update(csv).digest("hex");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="audit.csv"`);
    res.setHeader("X-Data-Hash", hash);
    res.send("\ufeff" + csv + "\n# sha256=" + hash + "\n");
});
router.get("/attestations.zip", auth_1.authRequired, (0, auth_1.requireRole)("ADMIN", "FORMATEUR"), async (req, res) => {
    const sessionId = String(req.query.sessionId || "");
    if (!sessionId)
        return res.status(400).json({ error: "sessionId requis" });
    const session = await prisma_1.prisma.session.findUnique({
        where: { id: sessionId },
        include: {
            training: true,
            enrollments: {
                include: {
                    user: true,
                    session: { include: { training: true, modules: true } },
                },
            },
        },
    });
    if (!session)
        return res.status(404).json({ error: "Session introuvable" });
    const archive = (0, archiver_1.default)("zip", { zlib: { level: 9 } });
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="attestations_${sessionId}.zip"`);
    archive.pipe(res);
    for (const enr of session.enrollments) {
        const cmi = await prisma_1.prisma.scormCmi.findMany({
            where: { enrollmentId: enr.id },
        });
        const totalModules = session.modules.length || 1;
        const completed = cmi.filter((x) => (x.lessonStatus || "").match(/completed|passed/i)).length;
        const progressPct = Math.round((completed / totalModules) * 100);
        const today = (0, dayjs_1.default)().format("DD/MM/YYYY");
        const crypto = await Promise.resolve().then(() => __importStar(require("crypto")));
        const hash = crypto
            .createHash("sha256")
            .update(JSON.stringify({ enrollmentId: enr.id, progressPct }))
            .digest("hex");
        const QRCode = (await Promise.resolve().then(() => __importStar(require("qrcode")))).default;
        const qr = await QRCode.toDataURL("sha256:" + hash);
        const html = await ejs_1.default.renderFile(__dirname + "/../templates/attestation.ejs", {
            user: enr.user,
            session: enr.session,
            training: session.training,
            progressPct,
            today,
            hash,
            qr,
            dayjs: dayjs_1.default,
        });
        const pdf = await (0, pdf_1.htmlToPdfBuffer)(html);
        archive.append(pdf, {
            name: `attestation_${enr.user.lastName || ""}_${enr.user.firstName || ""}_${enr.id}.pdf`.replace(/\s+/g, "_"),
        });
    }
    await archive.finalize();
});
