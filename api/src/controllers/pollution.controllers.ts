import { Request, Response } from "express";
import db from "../models";
import { PollutionInstance } from "../models/pollutions.model";

const Pollutions = db.pollutions;

/**
 * Normalise un enregistrement de pollution pour garantir la compatibilité
 * entre le format de données initial (ville/polluant/valeur)
 * et le format attendu par le frontend (titre/type/lieu/date/description).
 */
function normalizePollution(item: PollutionInstance | any): any {
  const json = typeof item.toJSON === "function" ? item.toJSON() : { ...item };
  const polluant = json.polluant || json.type || "Pollution";
  const ville = json.ville || json.lieu || "";
  
  return {
    id: json.id,
    titre: json.titre || `${polluant}${ville ? " à " + ville : ""}`,
    type: json.type || json.polluant || "Autre",
    lieu: json.lieu || json.ville || "",
    latitude: json.latitude !== null && json.latitude !== undefined ? Number(json.latitude) : 0,
    longitude: json.longitude !== null && json.longitude !== undefined ? Number(json.longitude) : 0,
    photo: json.photo || "",
    ville: json.ville || json.lieu || "",
    valeur: json.valeur !== null && json.valeur !== undefined ? Number(json.valeur) : null,
    polluant: json.polluant || json.type || "",
    date: json.date || new Date().toISOString().slice(0, 10),
    description: json.description || ""
  };
}

/**
 * GET /api/pollutions
 * Récupère la liste de toutes les mesures de pollution depuis la base PostgreSQL.
 */
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Pollutions.findAll({
      order: [["id", "ASC"]]
    });
    res.status(200).json(data.map(normalizePollution));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: "Erreur lors de la récupération des données de pollution: " + message
    });
  }
};

/**
 * GET /api/pollutions/:id
 * Récupère une mesure de pollution par son identifiant.
 */
export const getById = async (req: Request, res: Response): Promise<void> => {
  const paramId = req.params.id;
  const id = Array.isArray(paramId) ? Number(paramId[0]) : Number(paramId);
  try {
    const data = await Pollutions.findByPk(id);
    if (data) {
      res.status(200).json(normalizePollution(data));
    } else {
      res.status(404).json({
        message: `Aucune pollution trouvée avec l'id=${id}.`
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la récupération de la pollution id=${id}: ` + message
    });
  }
};

/**
 * POST /api/pollutions
 * Ajoute une nouvelle pollution dans la base PostgreSQL.
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body || {};
    const polluant = body.polluant || body.type || "Autre";
    const ville = body.ville || body.lieu || "Lieu non précisé";
    const titre = body.titre || `${polluant} à ${ville}`;
    const type = body.type || polluant;
    const lieu = body.lieu || ville;
    const date = body.date || new Date().toISOString().slice(0, 10);
    const description = body.description || "";
    const latitude = body.latitude !== undefined && body.latitude !== null && body.latitude !== "" ? Number(body.latitude) : 0;
    const longitude = body.longitude !== undefined && body.longitude !== null && body.longitude !== "" ? Number(body.longitude) : 0;
    const photo = body.photo || "";
    const valeur = body.valeur !== undefined && body.valeur !== null && body.valeur !== "" ? Number(body.valeur) : null;

    const newPollution = await Pollutions.create({
      titre,
      type,
      lieu,
      latitude,
      longitude,
      photo,
      ville,
      valeur,
      polluant,
      date,
      description
    });

    res.status(201).json(normalizePollution(newPollution));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: "Erreur lors de la création de la pollution: " + message
    });
  }
};

/**
 * PUT /api/pollutions/:id
 * Modifie une pollution existante par son identifiant.
 */
export const update = async (req: Request, res: Response): Promise<void> => {
  const paramId = req.params.id;
  const id = Array.isArray(paramId) ? Number(paramId[0]) : Number(paramId);

  try {
    const pollution = await Pollutions.findByPk(id);
    if (!pollution) {
      res.status(404).json({
        message: `Impossible de modifier : pollution introuvable avec l'id=${id}.`
      });
      return;
    }

    const body = req.body || {};
    const updatedFields: Record<string, any> = {};

    if (body.titre !== undefined) updatedFields.titre = body.titre;
    if (body.type !== undefined) {
      updatedFields.type = body.type;
      if (body.polluant === undefined) updatedFields.polluant = body.type;
    }
    if (body.lieu !== undefined) {
      updatedFields.lieu = body.lieu;
      if (body.ville === undefined) updatedFields.ville = body.lieu;
    }
    if (body.ville !== undefined) {
      updatedFields.ville = body.ville;
      if (body.lieu === undefined) updatedFields.lieu = body.ville;
    }
    if (body.polluant !== undefined) {
      updatedFields.polluant = body.polluant;
      if (body.type === undefined) updatedFields.type = body.polluant;
    }
    if (body.valeur !== undefined) updatedFields.valeur = body.valeur !== null && body.valeur !== "" ? Number(body.valeur) : null;
    if (body.date !== undefined) updatedFields.date = body.date;
    if (body.description !== undefined) updatedFields.description = body.description;
    if (body.latitude !== undefined) updatedFields.latitude = body.latitude !== null && body.latitude !== "" ? Number(body.latitude) : 0;
    if (body.longitude !== undefined) updatedFields.longitude = body.longitude !== null && body.longitude !== "" ? Number(body.longitude) : 0;
    if (body.photo !== undefined) updatedFields.photo = body.photo;

    await pollution.update(updatedFields);
    res.status(200).json(normalizePollution(pollution));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la mise à jour de la pollution id=${id}: ` + message
    });
  }
};

/**
 * DELETE /api/pollutions/:id
 * Supprime une pollution par son identifiant.
 */
export const deletePollution = async (req: Request, res: Response): Promise<void> => {
  const paramId = req.params.id;
  const id = Array.isArray(paramId) ? Number(paramId[0]) : Number(paramId);

  try {
    const deletedCount = await Pollutions.destroy({
      where: { id }
    });

    if (deletedCount === 1) {
      res.status(200).json({
        message: `La pollution avec l'id=${id} a été supprimée avec succès.`,
        success: true
      });
    } else {
      res.status(404).json({
        message: `Impossible de supprimer : pollution introuvable avec l'id=${id}.`
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la suppression de la pollution id=${id}: ` + message
    });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  deletePollution
};
