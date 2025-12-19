// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "15mb" })); // под JSON/тексты
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Статика (твой фронт)
app.use(express.static(__dirname));

// ---- API ----
// Вариант 1 (рекомендую): вынести логику из netlify/functions в обычные модули и дергать здесь.
// Но если пока хочешь "быстро и грязно", можно "обернуть" netlify handler:

import { handler as generateHandler } from "./netlify/functions/generate.js";
import { handler as feedbackHandler } from "./netlify/functions/feedback.js";

// адаптер Netlify handler -> Express
async function runNetlifyHandler(handler, req, res) {
  const event = {
    httpMethod: req.method,
    headers: req.headers,
    queryStringParameters: req.query,
    path: req.path,
    body: req.body ? JSON.stringify(req.body) : null,
    isBase64Encoded: false,
  };

  const result = await handler(event, {});
  res.status(result.statusCode || 200);

  // headers
  if (result.headers) {
    for (const [k, v] of Object.entries(result.headers)) res.setHeader(k, v);
  }

  // body
  res.send(result.body ?? "");
}

app.post("/api/generate", (req, res) => runNetlifyHandler(generateHandler, req, res));
app.post("/api/feedback", (req, res) => runNetlifyHandler(feedbackHandler, req, res));

app.get("/health", (_, res) => res.status(200).send("ok"));

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`Listening on ${port}`));
