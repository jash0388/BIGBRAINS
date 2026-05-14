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

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    json(res, 405, { success: false, error: "Method not allowed" });
    return;
  }

  const body = (await readBody(req)) as Record<string, unknown>;
  const userName = (body?.userName ?? "").toString().trim();
  const otp      = (body?.otp      ?? "").toString().trim();

  if (!userName || !otp) {
    json(res, 400, { success: false, error: "userName and otp are required" });
    return;
  }

  try {
    const up = await fetch(
      `${BACKENDS.main}/my-account/validate-otp?otp=${encodeURIComponent(otp)}&username=${encodeURIComponent(userName)}`,
      { headers: { Accept: "application/json" } },
    );
    const data = (await up.json()) as Record<string, unknown>;
    const rawAuth = up.headers.get("authorization") || "";
    const token   = rawAuth.startsWith("Bearer ") ? rawAuth.slice(7) : rawAuth;

    if ((data.statusCode === "OK" || up.status === 200) && token) {
      let identificationNo = userName;
      try {
        const payload = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString(),
        );
        if (payload.identification_no) identificationNo = payload.identification_no;
      } catch { /* use fallback */ }

      let profile: Record<string, unknown> = {};
      try {
        const infoUp = await fetch(
          `${BACKENDS.main}/my-account/info?identificationNo=${encodeURIComponent(identificationNo)}`,
          { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } },
        );
        if (infoUp.ok) {
          const infoData = (await infoUp.json()) as Record<string, unknown>;
          const results = infoData?.result as unknown[];
          if (Array.isArray(results) && results.length > 0) {
            profile = results[0] as Record<string, unknown>;
          }
        }
      } catch { /* non-fatal */ }

      let myPaths: Record<string, unknown> = {};
      try {
        const mpUp = await fetch(`${BACKENDS.python}/student-choices/my-paths`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });
        if (mpUp.ok) myPaths = (await mpUp.json()) as Record<string, unknown>;
      } catch { /* non-fatal */ }

      let academicProgress: Record<string, unknown> = {};
      try {
        const apUp = await fetch(
          `${BACKENDS.node}/student/user-paths/academic-paths/all-courses`,
          { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } },
        );
        if (apUp.ok) academicProgress = (await apUp.json()) as Record<string, unknown>;
      } catch { /* non-fatal */ }

      json(res, 200, { success: true, token, profile, myPaths, academicProgress });
    } else {
      json(res, 400, { success: false, error: "Incorrect OTP. Please try again." });
    }
  } catch (err) {
    console.error("verify-otp proxy failed", err);
    json(res, 502, { success: false, error: "Network error. Try again." });
  }
}
