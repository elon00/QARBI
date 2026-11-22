import express from "express";
import rateLimit from "express-rate-limit";
import path from "node:path";
import dotenv from "dotenv";
import { qarbiApi } from "./src/lib/qarbi-api.js";

dotenv.config();
const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use("/api", rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: "draft-8", legacyHeaders: false }));
app.use("/api", express.json({ limit: "8kb" }), async (req, res) => {
  const headers = new Headers();
  const contentType = req.get("Content-Type");
  if (contentType) headers.set("Content-Type", contentType);
  const response = await qarbiApi(new Request(new URL(req.originalUrl, "http://localhost"), {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" || req.body === undefined
      ? undefined : JSON.stringify(req.body),
  }));
  for (const [key, value] of response.headers) res.setHeader(key, value);
  res.status(response.status).send(await response.text());
});

async function start() {
  if (process.env.NODE_ENV !== "production" && !process.argv[1]?.includes("dist")) {
    const { createServer } = await import("vite");
    const vite = await createServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const dist = path.resolve("dist");
    app.use(express.static(dist));
    app.get("/{*path}", (_req, res) => res.sendFile(path.join(dist, "index.html")));
  }
  app.listen(port, "0.0.0.0", () => console.log("QARBI listening on port " + port));
}

start().catch(error => {
  console.error("QARBI failed to start:", error.message);
  process.exitCode = 1;
});
