// server.js (Railway-ready, no Netlify)
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { handler as generateHandler } from "./api/generate.js";
import { handler as feedbackHandler } from "./api/feedback.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// JSON payloads (front currently sends JSON)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Serve static frontend from repo root
app.use(express.static(__dirname));

async function runLambdaStyleHandler(handler, req, res) {
  // Build Netlify/AWS-Lambda-like event object (enough for your handlers)
  const event = {
    httpMethod: req.method,
    headers: req.headers,
    queryStringParameters: req.query,
    path: req.path,
    body: req.body ? JSON.stringify(req.body) : null,
    isBase64Encoded: false,
  };

  const result = await handler(event);

  // status
  res.status(result?.statusCode ?? 200);

  // headers
  if (result?.headers) {
    for (const [k, v] of Object.entries(result.headers)) {
      if (v !== undefined) res.setHeader(k, v);
    }
  }

  // body
  res.send(result?.body ?? "");
}

app.get("/health", (_req, res) => res.status(200).send("ok"));

app.post("/api/generate", (req, res) => runLambdaStyleHandler(generateHandler, req, res));
app.post("/api/feedback", (req, res) => runLambdaStyleHandler(feedbackHandler, req, res));

// SPA fallback (optional): serve index.html for unknown routes
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "index.html")));

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`Listening on ${port}`));
