import { Router } from "express";
import { prisma } from "../lib/prisma";
import { auditLog } from "../lib/audit";
import { authRequired } from "../lib/auth";

const router = Router();

router.post("/statements", authRequired, async (req: any, res) => {
  const statements = Array.isArray(req.body) ? req.body : [req.body];
  for (const st of statements) {
    await prisma.xapiStatement.create({
      data: {
        actor: st.actor,
        verb: st.verb,
        object: st.object,
        result: st.result ?? null,
        context: st.context ?? null,
        enrollmentId: st.context?.extensions?.enrollmentId ?? null
      }
    });
  }
  await auditLog(req as any, "XAPI_STORE", { count: statements.length });
  res.json({ stored: statements.length });
});

export default router;
