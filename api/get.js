// /api/get.js — Accepts a question, stores it in Redis, returns a numeric ID (1, 2, 3...)

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  try {
    const { q, t } = req.query;

    if (!q) {
      res.status(400).send("Error: Missing query parameter 'q'. Usage: /xxx/get?q=your-question&t=code|mcq");
      return;
    }

    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      res.status(500).send("Error: Redis is not configured on the server.");
      return;
    }

    // Increment the global counter to get the next ID (1, 2, 3, ...)
    const id = await redis.incr("question_counter");

    // Store the question data under this ID
    await redis.set(`question:${id}`, JSON.stringify({
      q: q,
      t: t || "default",
      ts: Date.now(),
    }));

    // Return just the numeric ID
    res.status(200).send(String(id));
  } catch (error) {
    console.error("Error generating ID:", error);
    res.status(500).send("Error: Failed to generate ID. " + (error.message || ""));
  }
}
