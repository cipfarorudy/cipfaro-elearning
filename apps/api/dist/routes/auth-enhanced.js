"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_enhanced_1 = require("../lib/auth-enhanced");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
// Schémas de validation
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email invalide"),
    password: zod_1.z
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, "Refresh token requis"),
});
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email invalide"),
    password: zod_1.z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    firstName: zod_1.z.string().min(1, "Prénom requis"),
    lastName: zod_1.z.string().min(1, "Nom requis"),
    role: zod_1.z
        .enum(["ADMIN", "FORMATEUR", "STAGIAIRE", "OPCO"])
        .optional()
        .default("STAGIAIRE"),
});
// POST /auth/login - Connexion
router.post("/login", async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const result = await (0, auth_enhanced_1.authenticateUser)(email, password);
        if (!result.success) {
            return res.status(401).json({
                success: false,
                error: result.error,
                code: "LOGIN_FAILED",
            });
        }
        // Enregistrer l'activité de connexion
        await prisma_1.prisma.auditLog
            .create({
            data: {
                userId: result.user.id,
                action: "LOGIN_SUCCESS",
                details: { ip: req.ip, userAgent: req.get("User-Agent") },
            },
        })
            .catch(() => { }); // Ne pas faire échouer si audit log fail
        res.json({
            success: true,
            message: "Connexion réussie",
            user: result.user,
            accessToken: result.tokens.accessToken,
            refreshToken: result.tokens.refreshToken,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: "Données invalides",
                details: error.errors,
                code: "VALIDATION_ERROR",
            });
        }
        console.error("Erreur de connexion:", error);
        res.status(500).json({
            success: false,
            error: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        });
    }
});
// POST /auth/register - Inscription (admin uniquement pour créer des comptes)
router.post("/register", auth_enhanced_1.authRequired, async (req, res) => {
    try {
        // Seuls les admins peuvent créer des comptes
        if (req.user?.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                error: "Seuls les administrateurs peuvent créer des comptes",
                code: "ADMIN_REQUIRED",
            });
        }
        const { email, password, firstName, lastName, role } = registerSchema.parse(req.body);
        // Vérifier si l'email existe déjà
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: "Un utilisateur avec cet email existe déjà",
                code: "EMAIL_EXISTS",
            });
        }
        // Créer l'utilisateur
        const bcrypt = await Promise.resolve().then(() => __importStar(require("bcrypt")));
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                firstName,
                lastName,
                role,
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
        // Enregistrer l'activité
        await prisma_1.prisma.auditLog
            .create({
            data: {
                userId: req.user.id,
                action: "USER_CREATED",
                details: {
                    newUserId: user.id,
                    newUserEmail: user.email,
                    newUserRole: user.role,
                },
            },
        })
            .catch(() => { });
        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès",
            user,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: "Données invalides",
                details: error.errors,
                code: "VALIDATION_ERROR",
            });
        }
        console.error("Erreur de création d'utilisateur:", error);
        res.status(500).json({
            success: false,
            error: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        });
    }
});
// POST /auth/refresh - Renouvellement de token
router.post("/refresh", async (req, res) => {
    try {
        const { refreshToken } = refreshSchema.parse(req.body);
        const result = await (0, auth_enhanced_1.refreshAccessToken)(refreshToken);
        if (!result.success) {
            return res.status(401).json({
                success: false,
                error: result.error,
                code: "REFRESH_FAILED",
            });
        }
        res.json({
            success: true,
            message: "Token renouvelé avec succès",
            user: result.user,
            accessToken: result.tokens.accessToken,
            refreshToken: result.tokens.refreshToken,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: "Refresh token invalide",
                code: "VALIDATION_ERROR",
            });
        }
        console.error("Erreur de renouvellement:", error);
        res.status(500).json({
            success: false,
            error: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        });
    }
});
// POST /auth/logout - Déconnexion
router.post("/logout", async (req, res) => {
    try {
        const { refreshToken } = refreshSchema.parse(req.body);
        await (0, auth_enhanced_1.logoutUser)(refreshToken);
        res.json({
            success: true,
            message: "Déconnexion réussie",
        });
    }
    catch (error) {
        console.error("Erreur de déconnexion:", error);
        res.status(500).json({
            success: false,
            error: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        });
    }
});
// GET /auth/me - Profil utilisateur actuel
router.get("/me", auth_enhanced_1.authRequired, async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Utilisateur non trouvé",
                code: "USER_NOT_FOUND",
            });
        }
        res.json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error("Erreur de récupération du profil:", error);
        res.status(500).json({
            success: false,
            error: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        });
    }
});
// PUT /auth/me - Mise à jour du profil
router.put("/me", auth_enhanced_1.authRequired, async (req, res) => {
    try {
        const updateSchema = zod_1.z.object({
            firstName: zod_1.z.string().min(1).optional(),
            lastName: zod_1.z.string().min(1).optional(),
            email: zod_1.z.string().email().optional(),
        });
        const updates = updateSchema.parse(req.body);
        // Vérifier si l'email est déjà utilisé
        if (updates.email && updates.email !== req.user.email) {
            const existingUser = await prisma_1.prisma.user.findUnique({
                where: { email: updates.email.toLowerCase() },
            });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    error: "Cet email est déjà utilisé",
                    code: "EMAIL_EXISTS",
                });
            }
        }
        const user = await prisma_1.prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...updates,
                email: updates.email?.toLowerCase(),
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                updatedAt: true,
            },
        });
        res.json({
            success: true,
            message: "Profil mis à jour avec succès",
            user,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: "Données invalides",
                details: error.errors,
                code: "VALIDATION_ERROR",
            });
        }
        console.error("Erreur de mise à jour du profil:", error);
        res.status(500).json({
            success: false,
            error: "Erreur interne du serveur",
            code: "INTERNAL_ERROR",
        });
    }
});
exports.default = router;
