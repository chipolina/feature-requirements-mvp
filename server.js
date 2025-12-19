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
// IMPORTANT: capture raw body for multipart (files)
app.post(
  "/api/generate",
  express.raw({ type: "*/*", limit: "20mb" }),
  (req, res) => runLambdaStyleHandler(generateHandler, req, res)
);



// JSON payloads (front currently sends JSON)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Serve static frontend from repo root
app.use(express.static(__dirname));

async function runLambdaStyleHandler(handler, req, res) {
  const contentType = req.headers["content-type"] || "";

  let body = null;
  let isBase64Encoded = false;

  if (Buffer.isBuffer(req.body)) {
    // express.raw() case
    if (contentType.includes("multipart/form-data")) {
      body = req.body.toString("base64");
      isBase64Encoded = true;
    } else {
      body = req.body.toString("utf8");
      isBase64Encoded = false;
    }
  } else if (req.body) {
    // express.json/urlencoded case
    body = JSON.stringify(req.body);
    isBase64Encoded = false;
  }

  const event = {
    httpMethod: req.method,
    headers: req.headers,
    queryStringParameters: req.query,
    path: req.path,
    body,
    isBase64Encoded,
  };

  const result = await handler(event);

  res.status(result?.statusCode ?? 200);
  if (result?.headers) {
    for (const [k, v] of Object.entries(result.headers)) {
      if (v !== undefined) res.setHeader(k, v);
    }
  }
  res.send(result?.body ?? "");
}


app.get("/health", (_req, res) => res.status(200).send("ok"));

app.post("/api/feedback", (req, res) => runLambdaStyleHandler(feedbackHandler, req, res));

// SPA fallback (optional): serve index.html for unknown routes
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "index.html")));

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`Listening on ${port}`));
