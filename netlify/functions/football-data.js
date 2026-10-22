
exports.handler = async function (event) {
  const token = process.env.FOOTBALL_DATA_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "FOOTBALL_DATA_TOKEN is not configured in Netlify."
      })
    };
  }

  const path = event.queryStringParameters?.path || "";

  if (
  !(
    path.startsWith("/v4/competitions/") ||
    path.startsWith("/v4/teams/")
  ) ||
  path.includes("..") ||
  path.includes("://")
) 
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid API path." })
    };
  }

  try {
    const url = new URL(
      path,
      "https://api.football-data.org"
    );

    const response = await fetch(url, {
      headers: { "X-Auth-Token": token }
    });

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      },
      body: await response.text()
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Football API request failed." })
    };
  }
};
