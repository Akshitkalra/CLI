// /api/answer.js — Fetches a previously stored answer by numeric ID from Redis

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  try {
    const { id } = req.query;

    if (!id) {
      res.status(400).send("Error: Missing query parameter 'id'. Usage: /xxx/answer?id=1");
      return;
    }

    // Fetch the stored data from Redis
    const data = await redis.get(`question:${id}`);

    if (!data) {
      res.status(404).send("Error: ID " + id + " not found.");
      return;
    }

    const payload = typeof data === "string" ? JSON.parse(data) : data;

    if (!payload.answer) {
      res.status(404).send("Error: No answer stored for ID " + id);
      return;
    }

    // Return the stored answer
    res.status(200).send(payload.answer);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error: " + (error.message || ""));
  }
}
