"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = generateTokens;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.authRequired = authRequired;
exports.authOptional = authOptional;
exports.requireRole = requireRole;
exports.requireOwnerOrAdmin = requireOwnerOrAdmin;
exports.authenticateUser = authenticateUser;
exports.refreshAccessToken = refreshAccessToken;
exports.logoutUser = logoutUser;
exports.cleanupExpiredTokens = cleanupExpiredTokens;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("./prisma");
// Configuration JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
// Génération de tokens
function generateTokens(user) {
    const accessToken = jsonwebtoken_1.default.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
    return { accessToken, refreshToken };
}
// Vérification du token d'accès
function verifyAccessToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
}
// Vérification du refresh token
function verifyRefreshToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
    }
    catch (error) {
        return null;
    }
}
// Hash du mot de passe
async function hashPassword(password) {
    return bcrypt_1.default.hash(password, 12);
}
// Vérification du mot de passe
async function verifyPassword(password, hash) {
    return bcrypt_1.default.compare(password, hash);
}
// Middleware d'authentification requis
function authRequired(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) {
        return res.status(401).json({
            error: "Token d'authentification requis",
            code: "MISSING_TOKEN",
        });
    }
    const user = verifyAccessToken(token);
    if (!user) {
        return res.status(401).json({
            error: "Token invalide ou expiré",
            code: "INVALID_TOKEN",
        });
    }
    req.user = user;
    next();
}
// Middleware optionnel d'authentification
function authOptional(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (token) {
        const user = verifyAccessToken(token);
        if (user) {
            req.user = user;
        }
    }
    next();
}
// Middleware de vérification de rôle
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: "Authentification requise",
                code: "AUTH_REQUIRED",
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: `Accès refusé. Rôles requis: ${roles.join(", ")}`,
                code: "INSUFFICIENT_PERMISSIONS",
                requiredRoles: roles,
                userRole: req.user.role,
            });
        }
        next();
    };
}
// Middleware de vérification de propriétaire ou admin
function requireOwnerOrAdmin(userIdField = "userId") {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: "Authentification requise",
                code: "AUTH_REQUIRED",
            });
        }
        // Admin a accès à tout
        if (req.user.role === "ADMIN") {
            return next();
        }
        // Vérifier si l'utilisateur est propriétaire de la ressource
        const resourceUserId = req.params[userIdField] || req.body[userIdField];
        if (req.user.id === resourceUserId) {
            return next();
        }
        return res.status(403).json({
            error: "Accès refusé. Vous ne pouvez accéder qu'à vos propres ressources",
            code: "RESOURCE_ACCESS_DENIED",
        });
    };
}
// Fonction d'authentification par email/mot de passe
async function authenticateUser(email, password) {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
                firstName: true,
                lastName: true,
                isActive: true,
            },
        });
        if (!user || !user.isActive) {
            return { success: false, error: "Utilisateur non trouvé ou inactif" };
        }
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            return { success: false, error: "Mot de passe incorrect" };
        }
        const userPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
        };
        const tokens = generateTokens(userPayload);
        // Enregistrer le refresh token en base de données
        await prisma_1.prisma.refreshToken.create({
            data: {
                token: tokens.refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
            },
        });
        return {
            success: true,
            user: userPayload,
            tokens,
        };
    }
    catch (error) {
        console.error("Erreur d'authentification:", error);
        return { success: false, error: "Erreur interne du serveur" };
    }
}
// Fonction de renouvellement de token
async function refreshAccessToken(refreshToken) {
    try {
        const payload = verifyRefreshToken(refreshToken);
        if (!payload) {
            return { success: false, error: "Refresh token invalide" };
        }
        // Vérifier que le refresh token existe en base
        const storedToken = await prisma_1.prisma.refreshToken.findFirst({
            where: {
                token: refreshToken,
                userId: payload.id,
                expiresAt: { gt: new Date() },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        firstName: true,
                        lastName: true,
                        isActive: true,
                    },
                },
            },
        });
        if (!storedToken || !storedToken.user.isActive) {
            return {
                success: false,
                error: "Refresh token non trouvé ou utilisateur inactif",
            };
        }
        const userPayload = {
            id: storedToken.user.id,
            email: storedToken.user.email,
            role: storedToken.user.role,
            firstName: storedToken.user.firstName || undefined,
            lastName: storedToken.user.lastName || undefined,
        };
        const tokens = generateTokens(userPayload);
        // Mettre à jour le refresh token
        await prisma_1.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: {
                token: tokens.refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            success: true,
            user: userPayload,
            tokens,
        };
    }
    catch (error) {
        console.error("Erreur de renouvellement de token:", error);
        return { success: false, error: "Erreur interne du serveur" };
    }
}
// Fonction de déconnexion
async function logoutUser(refreshToken) {
    try {
        await prisma_1.prisma.refreshToken.deleteMany({
            where: { token: refreshToken },
        });
        return { success: true };
    }
    catch (error) {
        console.error("Erreur de déconnexion:", error);
        return { success: false, error: "Erreur interne du serveur" };
    }
}
// Nettoyage des tokens expirés
async function cleanupExpiredTokens() {
    try {
        await prisma_1.prisma.refreshToken.deleteMany({
            where: {
                expiresAt: { lt: new Date() },
            },
        });
    }
    catch (error) {
        console.error("Erreur de nettoyage des tokens:", error);
    }
}
