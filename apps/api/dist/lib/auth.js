"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = sign;
exports.authRequired = authRequired;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function sign(user) {
    return jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET, { expiresIn: "8h" });
}
function authRequired(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        req.user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch (e) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
function requireRole(...roles) {
    return (req, res, next) => {
        const r = req.user?.roles || [];
        if (roles.some((x) => r.includes(x)))
            return next();
        return res.status(403).json({ error: "Forbidden" });
    };
}
