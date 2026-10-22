
exports.handler = async function (event) {
  const token = process.env.FOOTBALL_DATA_TOKEN;

  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  if (!token) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "FOOTBALL_DATA_TOKEN is not configured in Netlify."
      })
    };
  }

  const path = event.queryStringParameters?.path || "";

  const allowedPath =
    path.startsWith("/v4/competitions/") ||
    path.startsWith("/v4/teams/");

  if (
    !allowedPath ||
    path.includes("..") ||
    path.includes("://") ||
    path.includes("\\") ||
    path.includes("?") ||
    path.includes("#")
  ) {
    return {
      statusCode: 400,
      headers,
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
      headers,
      body: await response.text()
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        error: "Football API request failed."
      })
    };
  }
};
