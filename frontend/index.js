document.getElementById("search-btn").addEventListener("click", async () => {
  const siret = document.getElementById("siret").value.trim();

  if (!siret) {
    alert("Veuillez entrer un numéro de SIRET.");
    return;
  }

  try {
    // Appel à l'API backend pour récupérer les données sur l'entreprise
    const response = await fetch(`/api/recherche?siret=${siret}`);
    const data = await response.json();

    if (response.ok) {
      // Appeler la fonction pour afficher les données de l'entreprise
      displayResults(data);
    } else {
      alert(data.error || "Une erreur s'est produite.");
    }
  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
    alert("Une erreur s'est produite lors de la recherche.");
  }
});

function displayResults(data) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Réinitialiser les résultats

  if (!data || !data.items || data.items.length === 0) {
    resultsContainer.innerHTML =
      "<p>Aucune entreprise trouvée pour ce numéro de SIRET.</p>";
    return;
  }

  // Itérer sur les résultats de l'API et créer une carte pour chaque entreprise
  data.items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <h3>${item.company_name}</h3>
        <p><span class="highlight">SIRET:</span> ${item.siret}</p>
        <p><span class="highlight">Localisation:</span> ${item.city}, ${
      item.region
    }</p>
        <p><span class="highlight">Secteur d'activité:</span> ${
          item.naf_label
        }</p>
        <p><span class="highlight">Potentiel d'embauche:</span> ${item.hiring_potential.toFixed(
          2
        )}%</p>
        <p><span class="highlight">Effectif:</span> ${item.headcount_min} - ${
      item.headcount_max
    } membres</p>
      `;

    resultsContainer.appendChild(card);
  });
}
