// Cibler le bouton et les éléments nécessaires
const loadJobsButton = document.getElementById("load-jobs");
const jobList = document.getElementById("job-list");
const reportSection = document.getElementById("report-section");
const reportContent = document.getElementById("report-content");

// Fonction pour charger les offres d'emploi
async function loadJobs() {
  try {
    // Afficher un message de chargement
    jobList.innerHTML = "<p>Chargement des offres...</p>";

    // Envoyer une requête fetch à votre serveur backend
    const response = await fetch("/api/offres");

    // Vérification de la réponse du serveur
    console.log("Réponse du serveur:", response.status);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }

    const data = await response.json();
    console.log("Données reçues du serveur:", data);

    if (data && data.resultats && data.resultats.length > 0) {
      // Vider la liste avant d'afficher les offres
      jobList.innerHTML = "";

      // Créer et afficher les offres d'emploi
      data.resultats.forEach((job) => {
        const jobItem = document.createElement("div");
        jobItem.classList.add("job-item");

        jobItem.innerHTML = `
          <h2>${job.intitule}</h2>
          <p>${job.description}</p>
          <p><strong>Lieu:</strong> ${job.lieuTravail.libelle}</p>
          <p><strong>Type de contrat:</strong> ${job.typeContratLibelle}</p>
        `;
        jobList.appendChild(jobItem);
      });

      // Créer un rapport avec le nombre d'offres chargées
      reportSection.style.display = "block"; // Afficher la section de rapport
      reportContent.innerHTML = `
        <h3>Rapport</h3>
        <ul>
          <li><strong>Nombre d'offres chargées:</strong> ${data.resultats.length}</li>
          <li><strong>Premier poste:</strong> ${data.resultats[0].intitule}</li>
        </ul>
      `;
    } else {
      jobList.innerHTML = "<p>Aucune offre trouvée.</p>";
    }
  } catch (error) {
    // En cas d'erreur, afficher un message et logguer l'erreur
    jobList.innerHTML = "<p>Erreur lors du chargement des offres.</p>";
    console.error("Erreur:", error);
  }
}

// Ajouter un écouteur d'événements pour le bouton de chargement des offres
loadJobsButton.addEventListener("click", loadJobs);
