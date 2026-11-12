import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import db from "./models";
import initRoutes from "./routes";

const app: Application = express();

const corsOptions: CorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  exposedHeaders: "Authorization"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// health checks
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Welcome to Pollution & Users API." });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

// Initialisation et synchronisation de la base de données
const syncDatabase = async () => {
  try {
    try {
      await db.sequelize.sync({ alter: true });
    } catch {
      await db.sequelize.sync();
    }
    console.log("Synced db.");

    // Seeding des pollutions si la table est vide
    try {
      const pollutionCount = await db.pollutions.count();
      if (pollutionCount === 0) {
        await db.pollutions.bulkCreate([
          {
            titre: "Déchets plastiques au bord de l'eau",
            type: "Plastique",
            lieu: "Strasbourg - Parc de l'Orangerie",
            ville: "Strasbourg",
            polluant: "Plastique",
            valeur: 34.2,
            date: "2026-10-15",
            latitude: 48.5901,
            longitude: 7.7712,
            photo: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=500&auto=format&fit=crop&q=60",
            description: "Nombreuses bouteilles, emballages et plastiques abandonnés près des berges."
          },
          {
            titre: "Dépôt sauvage de gravats",
            type: "Dépôt sauvage",
            lieu: "Forêt de la Robertsau",
            ville: "Strasbourg",
            polluant: "Gravats",
            valeur: 42.0,
            date: "2026-10-18",
            latitude: 48.6214,
            longitude: 7.7955,
            photo: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop&q=60",
            description: "Amas important de gravats et débris de chantier déversés illégalement en lisière de forêt."
          },
          {
            titre: "Fumées suspectes zone portuaire",
            type: "Air",
            lieu: "Port du Rhin",
            ville: "Strasbourg",
            polluant: "NO2",
            valeur: 55.0,
            date: "2026-10-20",
            latitude: 48.5732,
            longitude: 7.7981,
            photo: "",
            description: "Émanations sombres et persistantes avec une odeur âcre observées en début de matinée."
          },
          {
            titre: "Nappe irisée d'hydrocarbures",
            type: "Eau",
            lieu: "Canal du Rhône au Rhin",
            ville: "Strasbourg",
            polluant: "Hydrocarbures",
            valeur: 28.5,
            date: "2026-10-21",
            latitude: 48.5523,
            longitude: 7.7654,
            photo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=60",
            description: "Traces d'huile et de carburant formant des reflets irisés en surface sur plusieurs mètres."
          },
          {
            titre: "Qualité de l'air dégradée au centre-ville",
            type: "Air",
            lieu: "Paris Centre",
            ville: "Paris",
            polluant: "PM2.5",
            valeur: 28.5,
            date: "2026-10-18",
            latitude: 48.8566,
            longitude: 2.3522,
            photo: "",
            description: "Qualité de l'air dégradée au centre-ville"
          },
          {
            titre: "Pic d'ozone en zone côtière",
            type: "Air",
            lieu: "Marseille Port",
            ville: "Marseille",
            polluant: "O3",
            valeur: 55.0,
            date: "2026-10-17",
            latitude: 43.2965,
            longitude: 5.3698,
            photo: "",
            description: "Ozone élevé en zone côtière ensoleillée"
          }
        ]);
        console.log("Jeu de données initial pour la table pollution inséré avec succès.");
      }
    } catch (seedErr: unknown) {
      console.warn("Remarque : impossible d'insérer les données d'initialisation pollution :", seedErr);
    }

    // Seeding des utilisateurs si la table est vide
    try {
      const userCount = await db.users.count();
      if (userCount === 0) {
        await db.users.bulkCreate([
          {
            login: "admin",
            password: "password123",
            nom: "Admin",
            prenom: "Super",
            email: "admin@cnam.fr"
          },
          {
            login: "simon",
            password: "password123",
            nom: "Erre",
            prenom: "Simon",
            email: "simon.erre@cnam.fr"
          },
          {
            login: "alice",
            password: "password123",
            nom: "Dupont",
            prenom: "Alice",
            email: "alice.dupont@cnam.fr"
          }
        ]);
        console.log("Jeu de données initial pour la table users inséré avec succès.");
      }
    } catch (userSeedErr: unknown) {
      console.warn("Remarque : impossible d'insérer les données d'initialisation utilisateurs :", userSeedErr);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.log("Failed to sync db: " + message);
  }
};

syncDatabase();

initRoutes(app);

// set port, listen on 0.0.0.0 for Render and container environments
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}.`);
  });
}

export default app;
