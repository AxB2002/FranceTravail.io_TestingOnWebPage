# France Travail Company Search API

🚀 **Project Description**

A web application to search for detailed information about French companies using their SIRET number through the France Travail (La Bonne Boîte) API.

✨ **Key Features**

- Search companies by SIRET number
- Display comprehensive company details
- Automatic JSON result storage
- Rate limiting to prevent API overload

🛠️ **Technologies Used**

- Backend: Node.js, Express
- Frontend: Vanilla HTML, JavaScript
- API: France Travail (La Bonne Boîte)
- HTTP Requests: Axios
- Rate Limiting: express-rate-limit

📦 **Extracted Company Information**

Each company search retrieves:

- Company name
- SIRET number
- Location (city, region)
- Business sector
- Hiring potential
- Staff size (min/max)

### 📝 Code Example

**JSON Response Structure**

```json
{
  "hits": 1,
  "items": [
    {
      "id": 12384661,
      "siret": "13000548100010",
      "company_name": "FRANCE TRAVAIL",
      "headcount_min": 1000,
      "headcount_max": 1999,
      "naf_label": "Public Administration of Economic Activities",
      "city": "Paris",
      "region": "Île-de-France",
      "hiring_potential": 91.74
    }
  ]
}
```

**Frontend Data Structure Display**

```javascript
function displayResults(data) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  if (!data || !data.items || data.items.length === 0) {
    resultsContainer.innerHTML =
      "<p>No company found for this SIRET number.</p>";
    return;
  }

  data.items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${item.company_name}</h3>
      <p><strong>SIRET:</strong> ${item.siret}</p>
      <p><strong>Location:</strong> ${item.city}, ${item.region}</p>
      <p><strong>Business Sector:</strong> ${item.naf_label}</p>
      <p><strong>Hiring Potential:</strong> ${item.hiring_potential.toFixed(
        2
      )}%</p>
      <p><strong>Staff Size:</strong> ${item.headcount_min} - ${
      item.headcount_max
    } employees</p>
    `;

    resultsContainer.appendChild(card);
  });
}
```

### Example Screenshot

Here is an example screenshot of the application displaying company data:

![TestResults](/results/FRANCE%20TRAVAIL_13000548100010/image.png)

🔒 **Security and Limitations**

- Rate limiting: 2 requests per second
- Error handling
- User input validation

💾 **Data Storage**

Each search generates a unique JSON file in a folder named:  
`CompanyName_SIRETNumber/SIRETNumber.json`

🚦 **Search Workflow**

1. User enters a SIRET number
2. Frontend sends request to backend
3. Backend calls France Travail API
4. Data displayed and saved

### 🔧 Installation

```bash
# Clone the repository
git clone [https://github.com/AxB2002/FranceTravail.io_TestingOnWebPage.git]

# Install dependencies
npm install

# Navigate to server location using the command prompt
cd backend

# Start the server
node server.js
```

📝 **Prerequisites**

- Node.js
- France Travail API Account
- Valid API Key

⚠️ **Known Limitations**

- Depends on France Travail API availability
- Limited to French companies
- Requires valid SIRET number

🔑 **Configuration**

Replace `_ce8WGfrJobh5sM0mID_17K9PoQ [Temporary KEY]` in `server.js` with your France Travail API key.

🤝 **Contributions**
Contributions are welcome. Please follow development best practices.
