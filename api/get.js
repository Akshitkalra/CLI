// /api/get.js — Accepts a question, returns a unique ID

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  try {
    const { q, t } = req.query;

    if (!q) {
      res.status(400).send("Error: Missing query parameter 'q'. Usage: /xxx/get?q=your-question&t=code|mcq");
      return;
    }

    // Build a payload with the question, type, and timestamp
    const payload = JSON.stringify({
      q: q,
      t: t || "default",
      ts: Date.now(),
    });

    // Encode it as a base64url ID
    const id = Buffer.from(payload).toString("base64url");

    // Return just the ID
    res.status(200).send(id);
  } catch (error) {
    console.error("Error generating ID:", error);
    res.status(500).send("Error: Failed to generate ID.");
  }
}
