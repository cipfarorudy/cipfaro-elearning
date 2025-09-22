import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";

export type JwtUser = {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
};

export interface AuthRequest extends Request {
  user?: JwtUser;
}

// Configuration JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

// Génération de tokens
export function generateTokens(user: JwtUser) {
  const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
}

// Vérification du token d'accès
export function verifyAccessToken(token: string): JwtUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtUser;
  } catch (error) {
    return null;
  }
}

// Vérification du refresh token
export function verifyRefreshToken(token: string): { id: string } | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };
  } catch (error) {
    return null;
  }
}

// Hash du mot de passe
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Vérification du mot de passe
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Middleware d'authentification requis
export function authRequired(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
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
export function authOptional(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
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
export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
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
export function requireOwnerOrAdmin(userIdField: string = "userId") {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
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
export async function authenticateUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
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

    const userPayload: JwtUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
    };

    const tokens = generateTokens(userPayload);

    // Enregistrer le refresh token en base de données
    await prisma.refreshToken.create({
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
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return { success: false, error: "Erreur interne du serveur" };
  }
}

// Fonction de renouvellement de token
export async function refreshAccessToken(refreshToken: string) {
  try {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return { success: false, error: "Refresh token invalide" };
    }

    // Vérifier que le refresh token existe en base
    const storedToken = await prisma.refreshToken.findFirst({
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

    const userPayload: JwtUser = {
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
      firstName: storedToken.user.firstName || undefined,
      lastName: storedToken.user.lastName || undefined,
    };

    const tokens = generateTokens(userPayload);

    // Mettre à jour le refresh token
    await prisma.refreshToken.update({
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
  } catch (error) {
    console.error("Erreur de renouvellement de token:", error);
    return { success: false, error: "Erreur interne du serveur" };
  }
}

// Fonction de déconnexion
export async function logoutUser(refreshToken: string) {
  try {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
    return { success: false, error: "Erreur interne du serveur" };
  }
}

// Nettoyage des tokens expirés
export async function cleanupExpiredTokens() {
  try {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  } catch (error) {
    console.error("Erreur de nettoyage des tokens:", error);
  }
}
