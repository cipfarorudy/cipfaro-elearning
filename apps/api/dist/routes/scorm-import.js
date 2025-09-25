"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const fast_xml_parser_1 = require("fast-xml-parser");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_1 = require("../lib/s3");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../lib/auth");
const audit_1 = require("../lib/audit");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });
const router = (0, express_1.Router)();
// POST /scorm/import/:moduleId  (form-data: package=<zip>)
router.post("/import/:moduleId", auth_1.authRequired, (0, auth_1.requireRole)("ADMIN"), upload.single("package"), async (req, res) => {
    const { moduleId } = req.params;
    if (!req.file)
        return res.status(400).json({ error: "ZIP manquant" });
    // 1) Stocker le ZIP sur S3/MinIO
    const s3Key = `scorm/${moduleId}/${Date.now()}.zip`;
    await s3_1.s3.send(new client_s3_1.PutObjectCommand({
        Bucket: s3_1.S3_BUCKET,
        Key: s3Key,
        Body: req.file.buffer,
        ContentType: "application/zip"
    }));
    // 2) Lire le manifest pour trouver le launch URL
    const zip = new adm_zip_1.default(req.file.buffer);
    const entry = zip.getEntry("imsmanifest.xml");
    if (!entry)
        return res.status(400).json({ error: "imsmanifest.xml introuvable" });
    const manifestXml = entry.getData().toString("utf-8");
    const parser = new fast_xml_parser_1.XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const man = parser.parse(manifestXml);
    // SCORM 1.2 typique : organizations > organization > item[@_identifierref]
    const org = man.manifest?.organizations?.organization;
    const item = Array.isArray(org?.item) ? org.item[0] : org?.item;
    const identifierref = item?.["@_identifierref"];
    const resources = man.manifest?.resources?.resource;
    const resArray = Array.isArray(resources) ? resources : [resources];
    const resource = resArray.find((r) => r?.["@_identifier"] === identifierref) || resArray[0];
    const href = resource?.["@_href"];
    if (!href)
        return res.status(400).json({ error: "Impossible de déterminer le launchUrl" });
    // 3) Enregistrer/mettre à jour ScormPackage
    const pkg = await prisma_1.prisma.scormPackage.upsert({
        where: { moduleId },
        update: { s3Key, launchUrl: href },
        create: { moduleId, s3Key, launchUrl: href }
    });
    await (0, audit_1.auditLog)(req, "SCORM_IMPORT", { moduleId, s3Key, launchUrl: href });
    res.status(201).json({ ok: true, package: pkg });
});
exports.default = router;
