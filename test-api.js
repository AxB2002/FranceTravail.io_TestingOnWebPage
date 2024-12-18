const fetch = require("node-fetch"); // Assurez-vous d'avoir installé la bibliothèque : npm install node-fetch

const API_URL =
  "https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search";
const API_TOKEN = "_9wZt-XDTGDXuCvDRIaGI5kI5QA";

async function fetchJobs() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    console.log("Statut de la réponse:", response.status);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Données reçues:", data);
  } catch (error) {
    console.error("Erreur lors de la requête:", error);
  }
}

fetchJobs();
