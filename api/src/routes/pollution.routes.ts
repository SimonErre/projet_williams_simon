import { Application, Router } from "express";
import pollutionController from "../controllers/pollution.controllers";

export default (app: Application): void => {
  const router = Router();

  // Route GET /api/pollutions (Lister toutes les pollutions)
  router.get("/", pollutionController.getAll);

  // Route GET /api/pollutions/:id (Détails d’une pollution)
  router.get("/:id", pollutionController.getById);

  // Route POST /api/pollutions (Ajouter une pollution)
  router.post("/", pollutionController.create);

  // Route PUT /api/pollutions/:id (Modifier une pollution)
  router.put("/:id", pollutionController.update);

  // Route DELETE /api/pollutions/:id (Supprimer une pollution)
  router.delete("/:id", pollutionController.deletePollution);

  // Exposition sous /api/pollutions et /api/pollution (pluriel et singulier)
  app.use("/api/pollutions", router);
  app.use("/api/pollution", router);
};
