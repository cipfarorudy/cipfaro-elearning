"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const audit_1 = require("../lib/audit");
const auth_1 = require("../lib/auth");
const router = (0, express_1.Router)();
router.post("/statements", auth_1.authRequired, async (req, res) => {
    const statements = Array.isArray(req.body) ? req.body : [req.body];
    for (const st of statements) {
        await prisma_1.prisma.xapiStatement.create({
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
    await (0, audit_1.auditLog)(req, "XAPI_STORE", { count: statements.length });
    res.json({ stored: statements.length });
});
exports.default = router;
