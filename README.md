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
