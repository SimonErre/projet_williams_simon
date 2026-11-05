import { Request, Response } from "express";
import crypto from "crypto";
import db from "../models";
import { UserInstance } from "../models/users.model";

const Users = db.users;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Hache un mot de passe en utilisant un sel aléatoire et l'algorithme scrypt (Node.js crypto natif).
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Vérifie un mot de passe par rapport au hash salé stocké.
 * Supporte également les anciens mots de passe en clair pour la rétrocompatibilité.
 */
export function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;
  if (!stored.includes(":")) {
    return stored === password;
  }
  const [salt, key] = stored.split(":");
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = crypto.scryptSync(password, salt, 32);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

/**
 * Filtre les données sensibles de l'utilisateur (supprime le mot de passe).
 */
function sanitizeUser(user: UserInstance | any): any {
  const json = typeof user.toJSON === "function" ? user.toJSON() : { ...user };
  const { password, ...safe } = json;
  return safe;
}

/**
 * GET /api/users
 * Récupère la liste de tous les utilisateurs enregistrés.
 */
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "login", "nom", "prenom", "email"],
      order: [["id", "ASC"]]
    });
    res.status(200).json(users);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs: " + message
    });
  }
};

/**
 * GET /api/users/:id
 * Récupère les détails d'un utilisateur par son identifiant.
 */
export const getById = async (req: Request, res: Response): Promise<void> => {
  const paramId = req.params.id;
  const id = Array.isArray(paramId) ? Number(paramId[0]) : Number(paramId);

  try {
    const user = await Users.findByPk(id, {
      attributes: ["id", "login", "nom", "prenom", "email"]
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        message: `Aucun utilisateur trouvé avec l'id=${id}.`
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la récupération de l'utilisateur id=${id}: ` + message
    });
  }
};

/**
 * POST /api/users
 * Créer un nouvel utilisateur avec validation et hachage du mot de passe.
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { login, password, nom, prenom, email } = req.body || {};

    if (!login || !nom || !prenom || !email) {
      res.status(400).json({
        message: "Tous les champs sont obligatoires : login, nom, prenom, email."
      });
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({
        message: "Le format de l'adresse email est invalide."
      });
      return;
    }

    // Vérifier si le login existe déjà
    const existing = await Users.findOne({ where: { login } });
    if (existing) {
      res.status(409).json({
        message: `Le login "${login}" est déjà utilisé. Veuillez en choisir un autre.`
      });
      return;
    }

    const rawPassword = password || "demo1234";
    const hashedPassword = hashPassword(rawPassword);

    const newUser = await Users.create({
      login,
      password: hashedPassword,
      nom,
      prenom,
      email
    });

    res.status(201).json(sanitizeUser(newUser));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur: " + message
    });
  }
};

/**
 * DELETE /api/users/:id
 * Supprime un utilisateur par son identifiant.
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const paramId = req.params.id;
  const id = Array.isArray(paramId) ? Number(paramId[0]) : Number(paramId);

  try {
    const deletedCount = await Users.destroy({
      where: { id }
    });

    if (deletedCount === 1) {
      res.status(200).json({
        message: `L'utilisateur avec l'id=${id} a été supprimé avec succès.`,
        success: true
      });
    } else {
      res.status(404).json({
        message: `Impossible de supprimer : utilisateur introuvable avec l'id=${id}.`
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la suppression de l'utilisateur id=${id}: ` + message
    });
  }
};

/**
 * POST /api/users/login
 * Authentification fictive d'un utilisateur avec vérification sécurisée.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { login, password } = req.body || {};

    if (!login) {
      res.status(400).json({ message: "Le login est requis." });
      return;
    }

    const user = await Users.findOne({ where: { login } });

    if (!user) {
      res.status(401).json({ message: "Utilisateur non trouvé ou identifiants incorrects." });
      return;
    }

    if (password && user.password && !verifyPassword(password, user.password)) {
      res.status(401).json({ message: "Mot de passe incorrect." });
      return;
    }

    res.status(200).json({
      message: "Connexion réussie !",
      user: sanitizeUser(user),
      token: `mock-jwt-token-${user.id}-${Date.now()}`
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: "Erreur lors de l'authentification: " + message
    });
  }
};

export default {
  getAll,
  getById,
  create,
  deleteUser,
  login,
  hashPassword,
  verifyPassword
};
