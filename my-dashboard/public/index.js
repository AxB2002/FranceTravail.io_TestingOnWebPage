let lastSearchTime = 0; // Dernière fois qu'une recherche a été effectuée

async function fetchData() {
  const siret = document.getElementById("siret").value;
  const loadingElement = document.getElementById("loading");
  const resultsElement = document.getElementById("results");

  const currentTime = Date.now();

  // Vérifier si 10 secondes se sont écoulées depuis la dernière recherche
  if (currentTime - lastSearchTime < 10000) {
    alert("Veuillez attendre 10 secondes avant de refaire une recherche.");
    return;
  }

  // Clear previous results and show loading message
  resultsElement.innerHTML = "";
  loadingElement.style.display = "block";

  try {
    const response = await fetch(`/api/recherche?siret=${siret}`);
    const data = await response.json();

    // Hide loading message
    loadingElement.style.display = "none";

    // Check if data is empty or invalid
    if (data.hits > 0) {
      displayResults(data.items);
    } else {
      resultsElement.innerHTML =
        '<p class="error">Aucune entreprise trouvée pour ce numéro de SIRET.</p>';
    }

    // Mettre à jour le temps de recherche
    lastSearchTime = currentTime;
  } catch (error) {
    loadingElement.style.display = "none";
    resultsElement.innerHTML = `<p class="error">Erreur: ${error.message}</p>`;
  }
}

function displayResults(data) {
  const resultsElement = document.getElementById("results");

  data.forEach((item) => {
    const resultDiv = document.createElement("div");
    resultDiv.classList.add("result-item");

    // Format the employee count
    const headcount = `${item.headcount_min} à ${item.headcount_max} employés`;

    // Format the location
    const location = `${item.city}, ${item.postcode}, ${item.region}`;

    // Check if the company has high hiring potential
    const highPotential = item.is_high_potential ? "Oui" : "Non";

    resultDiv.innerHTML = `
            <h3>${item.company_name} - ${
      item.office_name ? item.office_name : "N/A"
    }</h3>
            <p><strong>SIRET:</strong> ${item.siret}</p>
            <p><strong>Effectif:</strong> ${headcount}</p>
            <p><strong>Potentiel d'embauche:</strong> ${highPotential} (Score: ${item.hiring_potential.toFixed(
      2
    )})</p>
            <p><strong>NAF:</strong> ${item.naf_label}</p>
            <p><strong>Localisation:</strong> ${location}</p>
        `;

    resultsElement.appendChild(resultDiv);
  });
}
