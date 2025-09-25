"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.requireAuth = exports.requireFormateur = exports.requireAdmin = exports.requireRole = exports.hybridAuth = void 0;
const auth_enhanced_1 = require("./auth-enhanced");
/**
 * Middleware d'authentification hybride qui supporte
 * à la fois l'ancienne et la nouvelle authentification
 */
const hybridAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            error: "Token d'accès requis",
            code: "NO_TOKEN",
        });
    }
    const token = authHeader.substring(7);
    // Essayer d'abord avec la nouvelle authentification
    const user = (0, auth_enhanced_1.verifyAccessToken)(token);
    if (user) {
        req.user = user;
        req.authVersion = "enhanced";
        return next();
    }
    // Fallback vers l'ancienne authentification (si elle existe)
    try {
        // Ici, vous pouvez ajouter la logique de l'ancienne authentification
        // Pour l'instant, on retourne une erreur
        return res.status(401).json({
            success: false,
            error: "Token invalide ou expiré",
            code: "INVALID_TOKEN",
        });
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            error: "Token invalide",
            code: "INVALID_TOKEN",
        });
    }
};
exports.hybridAuth = hybridAuth;
exports.authMiddleware = exports.hybridAuth;
/**
 * Middleware pour vérifier les rôles
 */
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: "Authentification requise",
                code: "AUTH_REQUIRED",
            });
        }
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: "Permissions insuffisantes",
                code: "INSUFFICIENT_PERMISSIONS",
                required: allowedRoles,
                current: req.user.role,
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
/**
 * Middleware pour les administrateurs uniquement
 */
exports.requireAdmin = (0, exports.requireRole)("ADMIN");
/**
 * Middleware pour les formateurs et administrateurs
 */
exports.requireFormateur = (0, exports.requireRole)(["ADMIN", "FORMATEUR"]);
/**
 * Middleware pour tous les utilisateurs authentifiés
 */
exports.requireAuth = exports.hybridAuth;
