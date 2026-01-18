export default async function handler(req, res) {
  const STEAM_API_KEY = process.env.STEAM_API_KEY;

  const ids = [
    "76561199089712499", // OR3K4N
    "76561198353848309"  // zSaYx
  ].join(",");

  const url =
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/` +
    `?key=${STEAM_API_KEY}&steamids=${ids}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    res.status(200).json(json.response.players);
  } catch (err) {
    res.status(500).json({ error: "Steam API error" });
  }
}
