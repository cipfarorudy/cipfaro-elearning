import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export type JwtUser = { id: string; email: string; roles: string[] };

export function sign(user: JwtUser) {
  return jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "8h" });
}

export function authRequired(req: Request & { user?: JwtUser }, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as JwtUser;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request & { user?: JwtUser }, res: Response, next: NextFunction) => {
    const r = req.user?.roles || [];
    if (roles.some((x) => r.includes(x))) return next();
    return res.status(403).json({ error: "Forbidden" });
  };
}
