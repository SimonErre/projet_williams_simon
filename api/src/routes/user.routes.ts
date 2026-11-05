import { Application, Router } from "express";
import userController from "../controllers/user.controllers";

export default (app: Application): void => {
  const router = Router();

  // Route GET /api/users (Liste des utilisateurs)
  router.get("/", userController.getAll);

  // Route GET /api/users/:id (Détail d'un utilisateur)
  router.get("/:id", userController.getById);

  // Route POST /api/users (Créer un utilisateur)
  router.post("/", userController.create);

  // Route DELETE /api/users/:id (Supprimer un utilisateur)
  router.delete("/:id", userController.deleteUser);

  // Route POST /api/users/login (Authentification fictive)
  router.post("/login", userController.login);

  // Exposition sous /api/users et /api/user (pluriel et singulier)
  app.use("/api/users", router);
  app.use("/api/user", router);

  // Alias pour la création directe d'utilisateur (rétrocompatibilité /api/signup)
  app.post("/api/signup", userController.create);
};
