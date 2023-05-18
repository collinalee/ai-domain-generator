async function isDomainAvailable(domain) {
  console.log(`Checking availability for ${domain}`);

  try {
    const response = await fetch(
      `/.netlify/functions/checkDomainAvailability?domain=${domain}`
    );
    console.log(
      `Response Content-Type: ${response.headers.get("Content-Type")}`
    );
    const responseText = await response.text();
    console.log(`Response Text: ${responseText}`);
    const data = JSON.parse(responseText);
    console.log(`${domain} availability: ${data.data.available}`);
    return data.data.available;
  } catch (error) {
    console.error(`Error checking domain availability for ${domain}:`, error);
    throw error;
  }
}