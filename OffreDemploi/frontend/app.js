document.addEventListener("DOMContentLoaded", function () {
  const loadJobsButton = document.getElementById("load-jobs");
  const jobList = document.getElementById("job-list");
  const reportSection = document.getElementById("report-section");
  const reportContent = document.getElementById("report-content");
  const jobPopup = document.getElementById("job-popup");
  const jobPopupContent = document.getElementById("job-popup-content");
  const jobPopupClose = document.getElementById("job-popup-close");
  const loadingMessage = document.getElementById("loading-message");

  async function loadJobs() {
    try {
      // Afficher le message de chargement
      if (loadingMessage) {
        loadingMessage.style.display = "block";
      }

      if (jobList) {
        jobList.innerHTML = "<p>Chargement des offres...</p>";
      }

      const response = await fetch("/api/offres");

      console.log("Réponse du serveur:", response.status); // Affichage du code de statut de la réponse

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const data = await response.json();

      console.log("Données reçues de l'API:", data); // Affichage des données brutes reçues

      if (data && Array.isArray(data.resultats) && data.resultats.length > 0) {
        // Affichage des offres dans la console pour confirmer leur structure
        console.log("Offres récupérées:", data.resultats);

        // Trier les offres par mission
        const sortedJobs = data.resultats.map((job) => ({
          title: job.intitule, // Nom du poste
          description: job.description, // Description
          mission: job.mission,
          profile: job.profil,
          experience: job.experienceLibelle,
          savoirFaire: job.savoirFaire,
          contractType: job.typeContratLibelle,
          salaire: job.salaire,
          location: job.lieuTravail.libelle,
          competences: job.competences,
          duration: job.dureeTravailLibelle,
        }));

        console.log("Offres triées:", sortedJobs); // Affichage des offres triées

        // Vider la liste avant d'afficher les offres
        if (jobList) {
          jobList.innerHTML = "";

          sortedJobs.forEach((job) => {
            const jobCard = document.createElement("div");
            jobCard.classList.add("job-card");
            jobCard.innerHTML = `
                <h2>${job.title}</h2>
                <p><strong>Description:</strong> ${job.description}</p>
                <p><strong>Lieu:</strong> ${job.location}</p>
                <p><strong>Type de contrat:</strong> ${job.contractType}</p>
              `;

            // Log des données de chaque job pour la console
            console.log(`Affichage du job: ${job.title}`);
            console.log(`Détails du job: ${JSON.stringify(job)}`);

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
      console.error("Erreur:", error);
      if (jobList) {
        jobList.innerHTML = "<p>Erreur lors du chargement des offres.</p>";
      }
    } finally {
      // Cacher le message de chargement une fois les données récupérées
      if (loadingMessage) {
        loadingMessage.style.display = "none";
      }
    }
  }

  // Fonction pour ouvrir le pop-up avec le contenu de l'offre
  function openJobPopup(job) {
    if (jobPopup && jobPopupContent) {
      jobPopup.style.display = "block"; // Afficher le pop-up
      jobPopupContent.innerHTML = `
          <h2>${job.title}</h2>
          <p><strong>Description:</strong> ${job.description}</p>
          <p><strong>Profil:</strong> ${job.profile}</p>
          <p><strong>Expérience:</strong> ${job.experience}</p>
          <p><strong>Savoir-faire:</strong> ${job.savoirFaire}</p>
          <p><strong>Type de contrat:</strong> ${job.contractType}</p>
          <p><strong>Salaire:</strong> ${job.salaire}</p>
          <p><strong>Lieu:</strong> ${job.location}</p>
          <p><strong>Compétences:</strong> ${job.competences}</p>
          <p><strong>Durée du travail:</strong> ${job.duration}</p>
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
