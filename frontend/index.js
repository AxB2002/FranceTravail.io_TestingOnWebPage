document.getElementById("searchBtn").addEventListener("click", function () {
  const siret = document.getElementById("siret").value;

  if (!siret) {
    alert("Veuillez entrer un numéro de SIRET");
    return;
  }

  fetch(`/api/recherche?siret=${siret}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("results").innerHTML = `
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
    })
    .catch((error) => {
      document.getElementById("results").innerHTML = `Erreur: ${error.message}`;
    });
});
