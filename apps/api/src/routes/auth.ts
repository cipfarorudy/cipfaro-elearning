import { Router } from "express";
import { prisma } from "../lib/prisma";
import { sign } from "../lib/auth";
import { auditLog } from "../lib/audit";
import * as bcrypt from "bcryptjs";
import { z } from "zod";

const router = Router();

router.post("/login", async (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string().min(6) }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: body.email }, include: { roles: { include: { role: true } } } });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(body.password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: "Invalid credentials" });
  const token = sign({ id: user.id, email: user.email, roles: user.roles.map((ur) => ur.role.code) });
  await auditLog(req as any, "LOGIN_SUCCESS", { email: user.email });
  res.json({ token });
});

export default router;
