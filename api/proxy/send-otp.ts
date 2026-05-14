import type { IncomingMessage, ServerResponse } from "http";

const MAIN_BACKEND = "https://backend.rubrix.ai/api";

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

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    json(res, 405, { success: false, error: "Method not allowed" });
    return;
  }

  const body = (await readBody(req)) as Record<string, unknown>;
  const userName = (body?.userName ?? "").toString().trim();

  if (!userName) {
    json(res, 400, { success: false, error: "userName is required" });
    return;
  }

  try {
    const up = await fetch(
      `${MAIN_BACKEND}/my-account/get-otp?userName=${encodeURIComponent(userName)}`,
      { headers: { Accept: "application/json" } },
    );
    const data = (await up.json()) as Record<string, unknown>;

    if (data.status === "Success" && data.result === "OK") {
      json(res, 200, { success: true, message: data.description });
    } else {
      json(res, 400, {
        success: false,
        error: data.description || "Roll number not found.",
      });
    }
  } catch (err) {
    console.error("send-otp proxy failed", err);
    json(res, 502, { success: false, error: "Network error. Try again." });
  }
}
