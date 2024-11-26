const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();
const port = 3000;

// Middleware pour servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Rate limiter pour limiter les appels à 2 par seconde
const limiter = rateLimit({
  windowMs: 1000, // 1 seconde
  max: 2, // Limiter à 2 requêtes par seconde
  message:
    "Trop de requêtes, veuillez attendre une seconde avant de réessayer.",
  headers: true,
});

// Appliquer le rate limiter à toutes les requêtes
app.use(limiter);

// Point de terminaison pour rechercher une entreprise par SIRET
app.get("/api/recherche", async (req, res) => {
  const siret = req.query.siret; // Le numéro de SIRET passé comme paramètre

  // Vérifier si le SIRET a bien été fourni
  if (!siret) {
    return res.status(400).json({ error: "Le numéro de SIRET est requis." });
  }

  const apiUrl = `https://api.francetravail.io/partenaire/labonneboite/v2/potentielEmbauche?siret=${siret}`;
  const apiKey = "_ce8WGfrJobh5sM0mID_17K9PoQ";

  try {
    // Appel à l'API
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });

    const data = response.data;

    // Extraire le nom de l'entreprise et le numéro de SIRET
    const companyName = data.items[0]?.company_name || "UnknownCompany"; // Nom de la société
    const companySiret = data.items[0]?.siret || "UnknownSiret"; // SIRET de la société

    // Créer un dossier spécifique pour chaque entreprise
    const companyFolder = path.join(
      __dirname,
      "../results",
      `${companyName}_${companySiret}`
    );
    if (!fs.existsSync(companyFolder)) {
      fs.mkdirSync(companyFolder, { recursive: true }); // Crée le dossier, avec possibilité de créer des sous-dossiers
    }

    // Créer un fichier JSON pour cette recherche dans le dossier de l'entreprise
    const filePath = path.join(companyFolder, `${companySiret}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    // Retourner les données au frontend
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Une erreur s'est produite lors de la récupération des données.",
    });
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(
    `Le serveur est en cours d'exécution sur http://localhost:${port}`
  );
});
