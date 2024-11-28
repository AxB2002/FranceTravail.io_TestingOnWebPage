document.addEventListener("DOMContentLoaded", function () {
  const loadJobsButton = document.getElementById("load-jobs");
  const jobList = document.getElementById("job-list");
  const reportSection = document.getElementById("report-section");
  const reportContent = document.getElementById("report-content");
  const loadingMessage = document.getElementById("loading-message");

  // Fonction pour charger les offres d'emploi
  async function loadJobs() {
    try {
      console.log("Chargement des offres lancé...");

      // Afficher le message de chargement
      if (loadingMessage) {
        loadingMessage.style.display = "block";
        loadingMessage.textContent = "Recherche en cours...";
      }

      // Vider la liste des emplois précédemment affichés
      if (jobList) {
        jobList.innerHTML = "";
      }

      // Envoi de la requête à l'API
      const response = await fetch("/api/offres");

      console.log("Réponse du serveur : ", response.status);

      // Vérification de la réponse
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      // Convertir la réponse en JSON
      const data = await response.json();
      console.log("Données reçues de l'API : ", data);

      // Masquer le message de chargement une fois les données reçues
      if (loadingMessage) {
        loadingMessage.style.display = "none";
      }

      // Vérifier si des offres ont été retournées
      if (data && data.offres && data.offres.length > 0) {
        console.log("Offres trouvées : ", data.offres);

        // Trier les offres par titre de mission
        const sortedJobs = data.offres.map((job) => ({
          mission: job.intitule || "Aucune mission", // Ajouter une valeur par défaut si mission est undefined
          description: job.description || "Non disponible",
          profil: job.profil || "Non précisé",
          experience: job.experience || "Non précisé",
          savoirFaire: job.savoirFaire || "Non précisé",
          typeContrat: job.typeContrat || "Non précisé",
          remuneration: job.remuneration || "Non précisé",
          lieuTravail: job.lieuTravail || "Non précisé",
          experienceLibelle: job.experienceLibelle || "Non précisé",
          competences: job.competences || "Non précisé",
          salaire: job.salaire || "Non précisé",
          dureeTravailLibelle: job.dureeTravailLibelle || "Non précisé",
          dureeTravailLibelleConverti:
            job.dureeTravailLibelleConverti || "Non précisé",
        }));

        sortedJobs.sort((a, b) => {
          const missionA = a.mission.toLowerCase();
          const missionB = b.mission.toLowerCase();
          return missionA.localeCompare(missionB);
        });

        // Affichage des titres des offres
        sortedJobs.forEach((job) => {
          const jobCard = document.createElement("div");
          jobCard.classList.add("job-card");
          jobCard.innerHTML = `
              <h2>${job.mission}</h2>
            `;
          // Ajouter un événement au clic pour afficher les détails
          jobCard.addEventListener("click", () => openJobPopup(job));
          jobList.appendChild(jobCard);
        });

        // Afficher un rapport avec le nombre d'offres
        if (reportSection) {
          reportSection.style.display = "block";
          reportContent.innerHTML = `
              <h3>Rapport</h3>
              <ul>
                <li><strong>Nombre d'offres chargées :</strong> ${data.offres.length}</li>
              </ul>
            `;
        }
      } else {
        console.log("Aucune offre trouvée");
        if (jobList) {
          jobList.innerHTML = "<p>Aucune offre trouvée.</p>";
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des offres : ", error);
      if (jobList) {
        jobList.innerHTML = `<p>Erreur lors du chargement des offres. Détails : ${error.message}</p>`;
      }
      if (loadingMessage) {
        loadingMessage.style.display = "none";
      }
    }
  }

  // Fonction pour afficher le pop-up avec les détails de l'offre
  function openJobPopup(job) {
    const jobPopup = document.getElementById("job-popup");
    const jobPopupContent = document.getElementById("job-popup-content");

    if (jobPopup && jobPopupContent) {
      jobPopup.style.display = "block";
      jobPopupContent.innerHTML = `
          <h2>${job.mission}</h2>
          <p><strong>Description :</strong> ${job.description}</p>
          <p><strong>Profil :</strong> ${job.profil}</p>
          <p><strong>Expérience :</strong> ${job.experience}</p>
          <p><strong>Savoir-faire :</strong> ${job.savoirFaire}</p>
          <p><strong>Type de contrat :</strong> ${job.typeContrat}</p>
          <p><strong>Rémunération :</strong> ${job.remuneration}</p>
          <p><strong>Lieu de travail :</strong> ${job.lieuTravail}</p>
          <p><strong>Expérience Libellé :</strong> ${job.experienceLibelle}</p>
          <p><strong>Compétences :</strong> ${job.competences}</p>
          <p><strong>Salaire :</strong> ${job.salaire}</p>
          <p><strong>Durée de travail Libellé :</strong> ${job.dureeTravailLibelle}</p>
          <p><strong>Durée de travail Convertie :</strong> ${job.dureeTravailLibelleConverti}</p>
        `;
    }
  }

  // Clic sur le bouton de chargement des offres
  if (loadJobsButton) {
    loadJobsButton.addEventListener("click", loadJobs);
  }

  // Fermer le pop-up en cliquant sur le bouton de fermeture
  const jobPopupClose = document.getElementById("job-popup-close");
  if (jobPopupClose) {
    jobPopupClose.addEventListener("click", () => {
      const jobPopup = document.getElementById("job-popup");
      if (jobPopup) {
        jobPopup.style.display = "none";
      }
    });
  }
});
