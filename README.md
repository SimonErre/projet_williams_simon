# Projet Williams Simon

Projet web fullstack composé d'un frontend Angular et d'une API backend Node.js / Express.

## Structure du projet

```text
projet_williams_simon/
├── Front/      # Application frontend Angular
└── api/        # API REST backend Node.js (Express, Sequelize, PostgreSQL)
```

---

## 🎨 Frontend (`Front/`)

L'application frontend est développée avec **Angular** (SSR activé, Vitest pour les tests unitaires).

### Commandes utiles

Se placer dans le dossier frontend :
```bash
cd Front
```

- **Installation des dépendances :**
  ```bash
  npm install
  ```
- **Démarrage du serveur de développement :**
  ```bash
  npm start
  # ou npx ng serve
  ```
  Accessible sur [http://localhost:4200](http://localhost:4200).

- **Lancement des tests unitaires :**
  ```bash
  npm test
  # ou npx ng test --watch=false
  ```

- **Build de production :**
  ```bash
  npm run build
  ```

---

## ⚙️ Backend API (`api/`)

L'API backend est développée en **Node.js** avec **TypeScript**, **Express** et **Sequelize** (PostgreSQL).

### Commandes utiles

Se placer dans le dossier backend :
```bash
cd api
```

- **Installation des dépendances :**
  ```bash
  npm install
  ```
- **Démarrage en mode développement (hot-reload avec tsx) :**
  ```bash
  npm run dev
  ```
  Accessible sur [http://localhost:3000](http://localhost:3000).

- **Build TypeScript :**
  ```bash
  npm run build
  ```

- **Démarrage en production (après build) :**
  ```bash
  npm start
  ```

### Endpoints REST exposés

| Entité | Méthode | Route | Description |
| :--- | :--- | :--- | :--- |
| **Utilisateurs** | `POST` | `/api/users` | Créer un utilisateur |
| **Utilisateurs** | `GET` | `/api/users` | Liste des utilisateurs |
| **Utilisateurs** | `GET` | `/api/users/:id` | Consultation d'un utilisateur par son ID |
| **Utilisateurs** | `DELETE` | `/api/users/:id` | Suppression d'un utilisateur |
| **Utilisateurs** | `POST` | `/api/users/login` | Authentification fictive |
| **Pollutions** | `GET` | `/api/pollutions` | Lister toutes les pollutions |
| **Pollutions** | `GET` | `/api/pollutions/:id` | Détails d’une pollution |
| **Pollutions** | `POST` | `/api/pollutions` | Ajouter une pollution |
| **Pollutions** | `PUT` | `/api/pollutions/:id` | Modifier une pollution |
| **Pollutions** | `DELETE` | `/api/pollutions/:id` | Supprimer une pollution |
