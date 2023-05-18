async function generateDomainNameIdeas(prompt, aiResponses) {
  const requestBody = {
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      ...formatAiResponsesForRequest(aiResponses),
      { role: "user", content: prompt },
    ],
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };

  const response = await fetch(
    "/.netlify/functions/generateDomainNameIdeas",
    requestOptions
  );
  const data = await response.json();

  // Extract domain names
  const domainNameString = data.choices[0].message.content;
  const domainNames = domainNameString
    .split(",")
    .map((name) => name.trim());

  return {
    domainNames,
    aiResponse: data.choices[0].message.content,
  };
}