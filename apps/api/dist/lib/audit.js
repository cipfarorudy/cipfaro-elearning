"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = auditLog;
const prisma_1 = require("./prisma");
async function auditLog(req, event, meta) {
    try {
        const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || null;
        const asJson = meta ? JSON.parse(JSON.stringify(meta)) : null;
        await prisma_1.prisma.auditLog.create({
            data: {
                event,
                userId: req.user?.id || null,
                ip: ip || null,
                meta: asJson
            }
        });
    }
    catch (_) {
        // swallow audit errors
    }
}
