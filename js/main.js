// Helper function to create an element with optional attributes and content
function createElement(tag, attributes = {}, content = "") {
  const element = document.createElement(tag);
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  element.innerHTML = content;
  return element;
}

// Process the form submission
document
  .getElementById("domain-generator-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    // Show loading screen and hide form
    document.getElementById("domain-generator-form").style.display = "none";
    document.getElementById("loading-screen").style.display = "block";

    // Get form values
    const formValues = getFormValues();

    // Generate domain names and check availability
    try {
      const availableDomains = await generateAndCheckDomainNames(formValues);

      // Display results
      displayResults(availableDomains);

      // Hide loading screen and show results
      document.getElementById("loading-screen").style.display = "none";
      document.getElementById("results-list").style.display = "block";
    } catch (error) {
      console.error("Error generating domain names:", error);
      alert(
        "An error occurred while generating domain names. Please try again."
      );
      document.getElementById("loading-screen").style.display = "none";
      document.getElementById("domain-generator-form").style.display = "block";
    }
  });

function getFormValues() {
  console.log("Getting form values");
  const industry = document.getElementById("industry").value;
  const companyDescription = document.getElementById("company-description")
    .value;
  const domainExtensions = Array.from(
    document.getElementById("domain-extensions").selectedOptions
  ).map((option) => option.value);
  const namingCreativity = document.getElementById("naming-creativity").value;
  const targetAudience = document.getElementById("target-audience").value;

  return {
    industry,
    companyDescription,
    domainExtensions,
    namingCreativity,
    targetAudience
  };
}

async function generateAndCheckDomainNames(values) {
  let availableDomains = [];
  let unavailableDomains = [];
  let aiResponses = [];
  let prompt = getPrompt(values);

  while (availableDomains.length < 25) {
    try {
      // Generate domain names
      const domainNameIdeas = await generateDomainNameIdeas(prompt, aiResponses);
      const newDomainNames = domainNameIdeas.domainNames.filter(
        (domain) => !unavailableDomains.includes(domain)
      );

      // Check availability
      for (const domain of newDomainNames) {
        const isAvailable = await isDomainAvailable(domain);
        if (isAvailable) {
          availableDomains.push(domain);
        } else {
          unavailableDomains.push(domain);
        }
      }

      // Update AI responses and prompt
      aiResponses.push(domainNameIdeas.aiResponse);
      prompt = getPromptWithUnavailableDomains(unavailableDomains);
    } catch (error) {
      console.error("Error while generating and checking domain names:", error);
      throw error;
    }
  }

  return availableDomains;
}

function getPrompt(values) {
  return `Generate a list of 25 memorable, easy-to-pronounce, and brandable domain names for a business or startup in the ${
    values.industry
  } industry. Use the following company description to guide your suggestions: ${
    values.companyDescription
  }. The domain names should be short, catchy, and relevant to the industry. Consider a mix of naming styles and ${values.domainExtensions.join(
    ", "
  )} to generate the domain names. Apply ${
    values.namingCreativity
  } in the suggestions. The target audience is ${
    values.targetAudience
  }. Requirement: Separate the domain names with commas, and include only the domain names in the response. Example response format: domain.com,domain2.com,domain3.com,domain4.com`;
}

function getPromptWithUnavailableDomains(unavailableDomains) {
  return `The following domain names were unavailable: ${unavailableDomains.join(
    ", "
  )}. Generate 10 new domain name options based on this information and the information already provided.`;
}

function displayResults(availableDomains) {
  const resultsList = document.getElementById("results-list");

  // Clear previous results
  resultsList.innerHTML = "";

  // Create and append domain cards
  availableDomains.forEach((domain) => {
    const domainCard = createDomainCard(domain);
    resultsList.appendChild(domainCard);
  });

  // Show "Generate More" button
  document.getElementById("retry-button").style.display = "block";
}

function createDomainCard(domain) {
  const card = createElement("div", { class: "card my-3" });
  const cardBody = createElement("div", {
    class: "card-body d-flex justify-content-between align-items-center"
  });

  // Domain name
  const domainName = createElement(
    "h5",
    { class: "card-title mb-0" },
    domain.name
  );

  // Register button
  const registerLink = `https://godaddy.com/register/${domain.name}?refid=collinlee203`;
  const registerButton = createElement(
    "a",
    { class: "btn btn-primary", href: registerLink, target: "_blank" },
    "Register"
  );

  // Append elements to the card
  cardBody.appendChild(domainName);
  cardBody.appendChild(registerButton);
  card.appendChild(cardBody);

  return card;
}
// Handle the "Generate More" button click
document.getElementById("retry-button").addEventListener("click", (event) => {
  document.getElementById("results-list").style.display = "none";
  document.getElementById("retry-button").style.display = "none";
  document.getElementById("domain-generator-form").style.display = "block";
});
// Initialize the Select2 library for the domain-extensions and naming-creativity select boxes
$(document).ready(function () {
  $("#domain-extensions, #naming-creativity").select2({
    placeholder: "Select options",
    closeOnSelect: false,
    width: "100%"
  });
});
