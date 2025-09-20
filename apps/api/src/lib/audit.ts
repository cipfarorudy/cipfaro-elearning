import { prisma } from "./prisma";
import { Request } from "express";
import type { JwtUser } from "./auth";

export async function auditLog(req: Request & { user?: JwtUser }, event: string, meta?: any) {
  try {
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || null;
    const asJson = meta ? JSON.parse(JSON.stringify(meta)) : null;
    await prisma.auditLog.create({
      data: {
        event,
        userId: req.user?.id || null,
        ip: ip || null,
        meta: asJson
      }
    });
  } catch (_) {
    // swallow audit errors
  }
}
