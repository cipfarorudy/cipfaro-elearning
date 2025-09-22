import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtUser } from "./auth-enhanced";

// Étendre l'interface Request pour inclure les informations utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
      authVersion?: "legacy" | "enhanced";
    }
  }
}

/**
 * Middleware d'authentification hybride qui supporte
 * à la fois l'ancienne et la nouvelle authentification
 */
export const hybridAuth = (req: Request, res: Response, next: NextFunction) => {
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
  const user = verifyAccessToken(token);

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
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Token invalide",
      code: "INVALID_TOKEN",
    });
  }
};

/**
 * Middleware pour vérifier les rôles
 */
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
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

/**
 * Middleware pour les administrateurs uniquement
 */
export const requireAdmin = requireRole("ADMIN");

/**
 * Middleware pour les formateurs et administrateurs
 */
export const requireFormateur = requireRole(["ADMIN", "FORMATEUR"]);

/**
 * Middleware pour tous les utilisateurs authentifiés
 */
export const requireAuth = hybridAuth;

export { hybridAuth as authMiddleware };
