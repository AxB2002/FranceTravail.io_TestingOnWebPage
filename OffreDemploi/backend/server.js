import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Variables et configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const API_URL =
  "https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search";
const API_TOKEN = "cWpNrOpSvwjHvqwS_Ogqoq7JsF8";

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Route pour l'API
app.get("/api/offres", async (req, res) => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Erreur lors de l'appel API" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour toutes les autres requêtes : renvoyer l'index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
