import type { IncomingMessage, ServerResponse } from "http";

const BACKENDS: Record<string, string> = {
  main:        "https://backend.rubrix.ai/api",
  node:        "https://backend-node-apis.rubrix.ai/api",
  python:      "https://rubrix-backend-python.rubrix.ai/api",
  assessments: "https://assessments-backend.rubrix.ai/api",
};

function json(res: ServerResponse, status: number, data: unknown) {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { resolve({}); }
    });
    req.on("error", reject);
  });
}

export default async function handler(req: IncomingMessage & { query?: Record<string, string | string[]> }, res: ServerResponse) {
  const pathParam = req.query?.path;
  const segments = Array.isArray(pathParam)
    ? pathParam
    : typeof pathParam === "string"
      ? [pathParam]
      : [];

  const [backendName, ...rest] = segments;
  const baseUrl = backendName ? BACKENDS[backendName] : undefined;

  if (!baseUrl) {
    json(res, 404, { success: false, error: `Unknown backend: ${backendName}` });
    return;
  }

  const subPath = "/" + rest.join("/");
  const rawUrl = req.url ?? "";
  const qs = rawUrl.includes("?") ? "?" + rawUrl.split("?")[1] : "";
  const url = `${baseUrl}${subPath}${qs}`;

  const method = req.method ?? "GET";
  const headers: Record<string, string> = { Accept: "application/json" };
  if (req.headers.authorization) {
    headers.Authorization = req.headers.authorization;
  }

  const init: RequestInit = { method, headers };
  if (!["GET", "HEAD", "DELETE"].includes(method)) {
    headers["Content-Type"] = "application/json";
    const body = await readBody(req);
    init.body = JSON.stringify(body);
  }

  try {
    const up = await fetch(url, init);
    const ct = up.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await up.json();
      json(res, up.status, data);
    } else {
      const text = await up.text();
      res.setHeader("Content-Type", "text/plain");
      res.statusCode = up.status;
      res.end(text);
    }
  } catch (err) {
    console.error({ err, url }, "Rubrix proxy upstream error");
    json(res, 502, { success: false, error: "Upstream request failed" });
  }
}
