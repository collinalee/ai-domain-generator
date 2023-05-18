const axios = require("axios");

const DNSIMPLE_API_KEY = "your_dnsimple_api_key_here";

exports.handler = async (event, context) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const domain = event.queryStringParameters.domain;

  if (!domain) {
    return { statusCode: 400, body: "Domain parameter is required" };
  }

  try {
    const response = await axios.get(
      `https://api.dnsimple.com/v2/registrar/domains/${domain}/check`,
      {
        headers: {
          Authorization: `Bearer ${DNSIMPLE_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("Error checking domain availability:", error);
    return {
      statusCode: 500,
      body: "Error checking domain availability",
    };
  }
};