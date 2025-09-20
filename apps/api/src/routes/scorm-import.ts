import { Router } from "express";
import multer from "multer";
import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "../lib/s3";
import { prisma } from "../lib/prisma";
import { authRequired, requireRole } from "../lib/auth";
import { auditLog } from "../lib/audit";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });
const router = Router();

// POST /scorm/import/:moduleId  (form-data: package=<zip>)
router.post("/import/:moduleId", authRequired, requireRole("ADMIN"), upload.single("package"), async (req: any, res) => {
  const { moduleId } = req.params;
  if (!req.file) return res.status(400).json({ error: "ZIP manquant" });

  // 1) Stocker le ZIP sur S3/MinIO
  const s3Key = `scorm/${moduleId}/${Date.now()}.zip`;
  await s3.send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: s3Key,
    Body: req.file.buffer,
    ContentType: "application/zip"
  }));

  // 2) Lire le manifest pour trouver le launch URL
  const zip = new AdmZip(req.file.buffer);
  const entry = zip.getEntry("imsmanifest.xml");
  if (!entry) return res.status(400).json({ error: "imsmanifest.xml introuvable" });
  const manifestXml = entry.getData().toString("utf-8");

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const man = parser.parse(manifestXml);

  // SCORM 1.2 typique : organizations > organization > item[@_identifierref]
  const org = man.manifest?.organizations?.organization;
  const item = Array.isArray(org?.item) ? org.item[0] : org?.item;
  const identifierref = item?.["@_identifierref"];
  const resources = man.manifest?.resources?.resource;
  const resArray = Array.isArray(resources) ? resources : [resources];
  const resource = resArray.find((r: any) => r?.["@_identifier"] === identifierref) || resArray[0];
  const href = resource?.["@_href"];
  if (!href) return res.status(400).json({ error: "Impossible de déterminer le launchUrl" });

  // 3) Enregistrer/mettre à jour ScormPackage
  const pkg = await prisma.scormPackage.upsert({
    where: { moduleId },
    update: { s3Key, launchUrl: href },
    create: { moduleId, s3Key, launchUrl: href }
  });

  await auditLog(req as any, "SCORM_IMPORT", { moduleId, s3Key, launchUrl: href });
  res.status(201).json({ ok: true, package: pkg });
});

export default router;
