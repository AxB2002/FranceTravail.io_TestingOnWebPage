const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware pour servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static('public'));
app.use(express.json());

// Temps d'attente entre chaque recherche
let lastSearchTime = 0; // Dernière fois qu'une recherche a été effectuée

// Point de terminaison pour rechercher une entreprise par SIRET
app.get('/api/recherche', async (req, res) => {
    const siret = req.query.siret; // Le numéro de SIRET passé comme paramètre
    const currentTime = Date.now();

    // Vérifier si 10 secondes sont passées depuis la dernière recherche
    if (currentTime - lastSearchTime < 10000) {
        return res.status(429).json({ error: 'Veuillez attendre 10 secondes avant de refaire une recherche.' });
    }

    if (!siret) {
        return res.status(400).json({ error: 'Le numéro de SIRET est requis.' });
    }

    const apiUrl = `https://api.francetravail.io/partenaire/labonneboite/v2/potentielEmbauche?siret=${siret}`;
    const apiKey = 'lKB9fP9ie6D70TMqZVkkPxrBYPY';

    try {
        // Appel à l'API
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            }
        });

        const data = response.data;

        // Créer un dossier pour sauvegarder les résultats (si ce n'est pas déjà fait)
        const resultsFolder = path.join(__dirname, 'results');
        if (!fs.existsSync(resultsFolder)) {
            fs.mkdirSync(resultsFolder);
        }

        // Enregistrer les données dans un fichier JSON
        const filePath = path.join(resultsFolder, `${siret}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        // Mettre à jour le temps de recherche
        lastSearchTime = currentTime;

        // Retourner les données au frontend
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des données.' });
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Le serveur est en cours d'exécution sur http://localhost:${port}`);
});
