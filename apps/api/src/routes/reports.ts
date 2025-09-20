import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authRequired, requireRole } from "../lib/auth";
import crypto from "crypto";
import { htmlToPdfBuffer } from "../lib/pdf";
import ejs from "ejs";
import QRCode from "qrcode";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

const router = Router();

function csvEscape(v: any) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

router.get("/attendance.csv", authRequired, requireRole("ADMIN", "FORMATEUR"), async (req, res) => {
  const sessionId = String(req.query.sessionId || "");
  if (!sessionId) return res.status(400).json({ error: "sessionId requis" });

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { training: true, enrollments: { include: { user: true, attendance: true } } }
  });
  if (!session) return res.status(404).json({ error: "Session introuvable" });

  const rows = [["date","start_time","end_time","learner_name","email","session_title","training_title","method","evidence_url","enrollment_id"]];

  for (const enr of session.enrollments) {
    for (const att of enr.attendance) {
      rows.push([
        dayjs(att.date).format("YYYY-MM-DD"),
        dayjs(att.startTime).format("HH:mm"),
        dayjs(att.endTime).format("HH:mm"),
        `${enr.user.firstName || ""} ${enr.user.lastName || ""}`.trim(),
        enr.user.email,
        session.title,
        session.training.title,
        att.method,
        att.evidenceUrl || "",
        enr.id
      ]);
    }
  }

  const csv = rows.map(r => r.map(csvEscape).join(",")).join("\n");
  const hash = crypto.createHash("sha256").update(csv).digest("hex");
  const signedCsv = csv + "\n# sha256=" + hash + "\n";

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="attendance_${sessionId}.csv"`);
  res.setHeader("X-Data-Hash", hash);
  res.send("\ufeff" + signedCsv);
});

router.get("/attendance.pdf", authRequired, requireRole("ADMIN", "FORMATEUR"), async (req, res) => {
  const sessionId = String(req.query.sessionId || "");
  if (!sessionId) return res.status(400).json({ error: "sessionId requis" });

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { training: true, enrollments: { include: { user: true, attendance: true } } }
  });
  if (!session) return res.status(404).json({ error: "Session introuvable" });

  const rows: any[] = [];
  for (const enr of session.enrollments) {
    for (const att of enr.attendance) {
      rows.push({
        date: dayjs(att.date).format("DD/MM/YYYY"),
        start: dayjs(att.startTime).format("HH:mm"),
        end: dayjs(att.endTime).format("HH:mm"),
        learner: `${enr.user.firstName || ""} ${enr.user.lastName || ""}`.trim() || enr.user.email,
        email: enr.user.email,
        method: att.method,
        evidenceUrl: att.evidenceUrl || "",
        enrollmentId: enr.id
      });
    }
  }

  const payload = JSON.stringify({ sessionId, rows });
  const hash = crypto.createHash("sha256").update(payload).digest("hex");
  const qr = await QRCode.toDataURL("sha256:" + hash);

  const html = await ejs.renderFile(__dirname + "/../templates/attendance.ejs", {
    session,
    rows,
    hash,
    qr,
    dayjs
  });

  const pdf = await htmlToPdfBuffer(html);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="attendance_${sessionId}.pdf"`);
  res.setHeader("X-Data-Hash", hash);
  res.send(pdf);
});

router.get("/attestation/:enrollmentId.pdf", authRequired, requireRole("ADMIN", "FORMATEUR"), async (req, res) => {
  const enrollmentId = String(req.params.enrollmentId || "");
  const enr = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      user: true,
      session: { include: { training: true, modules: true } }
    }
  });
  if (!enr) return res.status(404).json({ error: "Enrollment introuvable" });

  const cmi = await prisma.scormCmi.findMany({ where: { enrollmentId } });
  const totalModules = enr.session.modules.length || 1;
  const completed = cmi.filter(x => (x.lessonStatus || "").match(/completed|passed/i)).length;
  const progressPct = Math.round((completed / totalModules) * 100);

  const today = dayjs().format("DD/MM/YYYY");
  const hash = crypto.createHash("sha256").update(JSON.stringify({ enrollmentId, progressPct })).digest("hex");
  const qr = await QRCode.toDataURL("sha256:" + hash);

  const html = await ejs.renderFile(__dirname + "/../templates/attestation.ejs", {
    user: enr.user,
    session: enr.session,
    training: enr.session.training,
    progressPct,
    today,
    hash,
    qr,
    dayjs
  });

  const pdf = await htmlToPdfBuffer(html);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="attestation_${enrollmentId}.pdf"`);
  res.setHeader("X-Data-Hash", hash);
  res.send(pdf);
});

export default router;


import archiver from "archiver";
import { Readable } from "stream";

router.get("/audit.csv", authRequired, requireRole("ADMIN"), async (req, res) => {
  const { userId, sessionId, event, from, to } = req.query as any;
  const where: any = {};
  if (userId) where.userId = userId;
  if (sessionId) where.sessionId = sessionId;
  if (event) where.event = String(event);
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }
  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });
  const header = ["createdAt","event","userId","sessionId","enrollmentId","moduleId","ip","meta"];
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
      l.meta ? JSON.stringify(l.meta) : ""
    ]);
  }
  function csvEscape(v: any) {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }
  const csv = rows.map(r => r.map(csvEscape).join(",")).join("\n");
  const crypto = await import("crypto");
  const hash = crypto.createHash("sha256").update(csv).digest("hex");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="audit.csv"`);
  res.setHeader("X-Data-Hash", hash);
  res.send("\ufeff" + csv + "\n# sha256=" + hash + "\n");
});

router.get("/attestations.zip", authRequired, requireRole("ADMIN", "FORMATEUR"), async (req, res) => {
  const sessionId = String(req.query.sessionId || "");
  if (!sessionId) return res.status(400).json({ error: "sessionId requis" });

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { training: true, enrollments: { include: { user: true, session: { include: { training: true, modules: true } } } } }
  });
  if (!session) return res.status(404).json({ error: "Session introuvable" });

  const archive = archiver("zip", { zlib: { level: 9 } });
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="attestations_${sessionId}.zip"`);
  archive.pipe(res);

  for (const enr of session.enrollments) {
    const cmi = await prisma.scormCmi.findMany({ where: { enrollmentId: enr.id } });
    const totalModules = session.modules.length || 1;
    const completed = cmi.filter(x => (x.lessonStatus || "").match(/completed|passed/i)).length;
    const progressPct = Math.round((completed / totalModules) * 100);

    const today = dayjs().format("DD/MM/YYYY");
    const crypto = await import("crypto");
    const hash = crypto.createHash("sha256").update(JSON.stringify({ enrollmentId: enr.id, progressPct })).digest("hex");
    const QRCode = (await import("qrcode")).default;
    const qr = await QRCode.toDataURL("sha256:" + hash);

    const html = await ejs.renderFile(__dirname + "/../templates/attestation.ejs", {
      user: enr.user,
      session: enr.session,
      training: session.training,
      progressPct,
      today,
      hash,
      qr,
      dayjs
    });

    const pdf = await htmlToPdfBuffer(html);
    archive.append(pdf, { name: `attestation_${enr.user.lastName or ''}_${enr.user.firstName or ''}_${enr.id}.pdf`.replace(/\s+/g, "_") });
  }

  await archive.finalize();
});
