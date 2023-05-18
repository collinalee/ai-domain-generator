const axios = require("axios");

const OPENAI_API_KEY = "your_openai_api_key_here";

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const requestBody = JSON.parse(event.body);

  if (!requestBody.messages) {
    return { statusCode: 400, body: "Missing messages in request body" };
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: requestBody.messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("Error generating domain name ideas:", error);
    return {
      statusCode: 500,
      body: "Error generating domain name ideas",
    };
  }
};