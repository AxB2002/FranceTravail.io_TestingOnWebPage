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

    // Envoyer une requête fetch à l'API pour récupérer les offres
    const response = await fetch("https://api.example.com/jobs"); // Remplacez par l'URL réelle de l'API
    const data = await response.json();

    if (data && data.length > 0) {
      // Vider la liste avant d'afficher les offres
      jobList.innerHTML = "";

      // Créer et afficher les offres d'emploi
      data.forEach((job) => {
        const jobItem = document.createElement("div");
        jobItem.classList.add("job-item");

        jobItem.innerHTML = `
                    <h2>${job.title}</h2>
                    <p>${job.description}</p>
                    <p><strong>Lieu:</strong> ${job.location}</p>
                `;
        jobList.appendChild(jobItem);
      });

      // Créer un rapport avec le nombre d'offres chargées
      reportSection.style.display = "block"; // Afficher la section de rapport
      reportContent.innerHTML = `
                <h3>Rapport</h3>
                <ul>
                    <li><strong>Nombre d'offres chargées:</strong> ${data.length}</li>
                    <li><strong>Premier poste:</strong> ${data[0].title}</li>
                </ul>
            `;
    } else {
      jobList.innerHTML = "<p>Aucune offre trouvée.</p>";
    }
  } catch (error) {
    // Gestion des erreurs en cas de problème avec la requête
    jobList.innerHTML = "<p>Erreur lors du chargement des offres.</p>";
    console.error("Erreur:", error);
  }
}

// Ajouter un écouteur d'événements pour le bouton de chargement des offres
loadJobsButton.addEventListener("click", loadJobs);
