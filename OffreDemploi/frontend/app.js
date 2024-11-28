document.addEventListener("DOMContentLoaded", function () {
  // Cibler les éléments nécessaires une fois le DOM chargé
  const loadJobsButton = document.getElementById("load-jobs");
  const jobList = document.getElementById("job-list");
  const reportSection = document.getElementById("report-section");
  const reportContent = document.getElementById("report-content");
  const jobPopup = document.getElementById("job-popup");
  const jobPopupContent = document.getElementById("job-popup-content");
  const jobPopupClose = document.getElementById("job-popup-close");

  // Fonction pour charger les offres d'emploi
  async function loadJobs() {
    try {
      // Afficher un message de chargement
      if (jobList) {
        jobList.innerHTML = "<p>Chargement des offres...</p>";
      }

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
        if (jobList) {
          jobList.innerHTML = "";

          // Créer et afficher les cartes avec les titres des offres d'emploi
          data.resultats.forEach((job) => {
            const jobCard = document.createElement("div");
            jobCard.classList.add("job-card");
            jobCard.innerHTML = `
                <h2>${job.intitule}</h2>
              `;

            // Ajouter un événement de clic pour ouvrir le pop-up
            jobCard.addEventListener("click", () => openJobPopup(job));

            jobList.appendChild(jobCard);
          });
        }

        // Créer un rapport avec le nombre d'offres chargées
        if (reportSection) {
          reportSection.style.display = "block"; // Afficher la section de rapport
          reportContent.innerHTML = `
              <h3>Rapport</h3>
              <ul>
                <li><strong>Nombre d'offres chargées:</strong> ${data.resultats.length}</li>
                <li><strong>Premier poste:</strong> ${data.resultats[0].intitule}</li>
              </ul>
            `;
        }
      } else {
        if (jobList) {
          jobList.innerHTML = "<p>Aucune offre trouvée.</p>";
        }
      }
    } catch (error) {
      // En cas d'erreur, afficher un message et logguer l'erreur
      console.error("Erreur:", error);
      if (jobList) {
        jobList.innerHTML = "<p>Erreur lors du chargement des offres.</p>";
      }
    }
  }

  // Fonction pour ouvrir le pop-up avec le contenu de l'offre
  function openJobPopup(job) {
    if (jobPopup && jobPopupContent) {
      jobPopup.style.display = "block"; // Afficher le pop-up
      jobPopupContent.innerHTML = `
          <h2>${job.intitule}</h2>
          <p><strong>Description:</strong> ${job.description}</p>
          <p><strong>Lieu:</strong> ${job.lieuTravail.libelle}</p>
          <p><strong>Type de contrat:</strong> ${job.typeContratLibelle}</p>
        `;
    }
  }

  // Ajouter un écouteur d'événements pour le bouton de chargement des offres
  if (loadJobsButton) {
    loadJobsButton.addEventListener("click", loadJobs);
  }

  // Fermer le pop-up lorsque l'utilisateur clique sur le bouton de fermeture
  if (jobPopupClose) {
    jobPopupClose.addEventListener("click", () => {
      if (jobPopup) {
        jobPopup.style.display = "none"; // Cacher le pop-up
      }
    });
  }
});
