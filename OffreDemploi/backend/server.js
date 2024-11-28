import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";

// Variables et configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const API_URL =
  "https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search";
const API_TOKEN = "tPOAmLO17V2o4fJqfRT2oEKnPn4"; // Remplacer par votre token valide

// Middleware pour limiter les appels à l'API
const limiter = rateLimit({
  windowMs: 1000, // 1 seconde
  max: 10, // Limite à 10 requêtes par seconde
  message: "Trop de requêtes envoyées, veuillez réessayer dans 1 seconde.",
});

// Utilisation du middleware de limitation
app.use("/api/offres", limiter);

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Route pour l'API
app.get("/api/offres", async (req, res) => {
  try {
    // Log avant d'envoyer la requête à l'API
    console.log("Envoi de la requête à l'API...");

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    // Log de la réponse de l'API
    console.log("Réponse de l'API, code:", response.status);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Erreur lors de l'appel API" });
    }

    const data = await response.json();

    // Log des données reçues
    console.log("Données reçues de l'API:", data);

    // Vérifier que les données contiennent bien des résultats
    if (data && data.resultats) {
      res.json(data); // Renvoie les résultats à l'utilisateur
    } else {
      console.log("Pas de résultats dans la réponse de l'API");
      res.status(500).json({ error: "Pas de résultats disponibles" });
    }
  } catch (error) {
    console.error("Erreur lors de la requête API:", error);
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
