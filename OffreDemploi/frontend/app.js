const API_URL = "http://localhost:3000/api/offres"; // Appel vers le backend

// Fonction pour récupérer les offres depuis le backend
async function fetchJobOffers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des offres.");
    const data = await response.json();
    displayJobs(data);
  } catch (error) {
    document.getElementById("job-list").innerHTML = `<p>${error.message}</p>`;
  }
}

// Fonction pour afficher les offres
function displayJobs(jobs) {
  const jobList = document.getElementById("job-list");
  jobList.innerHTML = "";

  if (jobs.length === 0) {
    jobList.innerHTML = "<p>Aucune offre trouvée.</p>";
    return;
  }

  jobs.forEach((job) => {
    const jobItem = document.createElement("div");
    jobItem.className = "job-item";
    jobItem.innerHTML = `
      <h2>${job.intitule}</h2>
      <p><strong>Description:</strong> ${job.description || "Non spécifiée"}</p>
      <p><strong>Lieu:</strong> ${job.lieuTravail.libelle || "Non spécifié"}</p>
      <p><strong>Entreprise:</strong> ${
        job.entreprise.nom || "Non spécifiée"
      }</p>
      <p><strong>Date de création:</strong> ${new Date(
        job.dateCreation
      ).toLocaleDateString("fr-FR")}</p>
      <p><strong>Type de contrat:</strong> ${
        job.typeContratLibelle || "Non spécifié"
      }</p>
    `;
    jobList.appendChild(jobItem);
  });
}

// Charger les offres au démarrage
fetchJobOffers();
