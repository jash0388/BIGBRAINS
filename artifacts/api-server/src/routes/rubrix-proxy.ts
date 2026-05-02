import { Router, Request, Response } from "express";

const router = Router();

const BACKENDS: Record<string, string> = {
  main:        "https://backend.rubrix.ai/api",
  node:        "https://backend-node-apis.rubrix.ai/api",
  python:      "https://rubrix-backend-python.rubrix.ai/api",
  assessments: "https://assessments-backend.rubrix.ai/api",
};

// ── Generic pass-through helper ──────────────────────────────────────────────
async function passThrough(
  req: Request,
  res: Response,
  baseUrl: string,
  subPath: string,
) {
  const qs = Object.keys(req.query).length
    ? "?" + new URLSearchParams(req.query as Record<string, string>).toString()
    : "";
  const url = `${baseUrl}${subPath}${qs}`;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (req.headers.authorization) headers.Authorization = req.headers.authorization;

  const init: RequestInit = { method: req.method, headers };
  if (!["GET", "HEAD", "DELETE"].includes(req.method)) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(req.body);
  }

  try {
    const up = await fetch(url, init);
    const ct = up.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await up.json();
      res.status(up.status).json(data);
    } else {
      const text = await up.text();
      res.status(up.status).type("text").send(text);
    }
  } catch (err) {
    req.log.error({ err, url }, "Rubrix proxy upstream error");
    res.status(502).json({ success: false, error: "Upstream request failed" });
  }
}

// ── Generic named-backend routes ─────────────────────────────────────────────
// /api/proxy/main/**        → backend.rubrix.ai/api/**
// /api/proxy/node/**        → backend-node-apis.rubrix.ai/api/**
// /api/proxy/python/**      → rubrix-backend-python.rubrix.ai/api/**
// /api/proxy/assessments/** → assessments-backend.rubrix.ai/api/**

for (const [name, base] of Object.entries(BACKENDS)) {
  router.use(`/${name}`, (req: Request, res: Response) => {
    passThrough(req, res, base, req.path).catch(() => {});
  });
}

// ── Auth: Send OTP ────────────────────────────────────────────────────────────
router.post("/send-otp", async (req: Request, res: Response) => {
  const userName = (req.body?.userName || "").toString().trim();
  if (!userName) { res.status(400).json({ success: false, error: "userName is required" }); return; }
  try {
    const up = await fetch(`${BACKENDS.main}/my-account/get-otp?userName=${encodeURIComponent(userName)}`, {
      headers: { Accept: "application/json" },
    });
    const data = await up.json() as Record<string, unknown>;
    if (data.status === "Success" && data.result === "OK") {
      res.json({ success: true, message: data.description });
    } else {
      res.status(400).json({ success: false, error: data.description || "Roll number not found." });
    }
  } catch (err) {
    req.log.error({ err }, "send-otp proxy failed");
    res.status(502).json({ success: false, error: "Network error. Try again." });
  }
});

// ── Auth: Verify OTP + fetch full profile ─────────────────────────────────────
router.post("/verify-otp", async (req: Request, res: Response) => {
  const userName = (req.body?.userName || "").toString().trim();
  const otp      = (req.body?.otp      || "").toString().trim();
  if (!userName || !otp) {
    res.status(400).json({ success: false, error: "userName and otp are required" });
    return;
  }
  try {
    const up = await fetch(
      `${BACKENDS.main}/my-account/validate-otp?otp=${encodeURIComponent(otp)}&username=${encodeURIComponent(userName)}`,
      { headers: { Accept: "application/json" } },
    );
    const data = await up.json() as Record<string, unknown>;
    const rawAuth = up.headers.get("authorization") || "";
    const token   = rawAuth.startsWith("Bearer ") ? rawAuth.slice(7) : rawAuth;

    if ((data.statusCode === "OK" || up.status === 200) && token) {
      // Decode JWT to get identification_no (e.g. "SPHN_STD_24N81A6758")
      let identificationNo = userName;
      try {
        const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
        if (payload.identification_no) identificationNo = payload.identification_no;
      } catch { /* use fallback */ }

      // Fetch base account info using full identification_no from JWT
      let profile: Record<string, unknown> = {};
      try {
        const infoUp = await fetch(
          `${BACKENDS.main}/my-account/info?identificationNo=${encodeURIComponent(identificationNo)}`,
          { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } },
        );
        if (infoUp.ok) {
          const infoData = await infoUp.json() as Record<string, unknown>;
          const results = infoData?.result as unknown[];
          if (Array.isArray(results) && results.length > 0) {
            profile = results[0] as Record<string, unknown>;
          }
        }
      } catch { /* non-fatal */ }

      // Fetch student's chosen career/skill paths (python backend)
      let myPaths: Record<string, unknown> = {};
      try {
        const mpUp = await fetch(`${BACKENDS.python}/student-choices/my-paths`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });
        if (mpUp.ok) { myPaths = await mpUp.json() as Record<string, unknown>; }
      } catch { /* non-fatal */ }

      // Fetch academic completion progress (node backend)
      let academicProgress: Record<string, unknown> = {};
      try {
        const apUp = await fetch(`${BACKENDS.node}/student/user-paths/academic-paths/all-courses`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });
        if (apUp.ok) { academicProgress = await apUp.json() as Record<string, unknown>; }
      } catch { /* non-fatal */ }

      res.json({ success: true, token, profile, myPaths, academicProgress });
    } else {
      res.status(400).json({ success: false, error: "Incorrect OTP. Please try again." });
    }
  } catch (err) {
    req.log.error({ err }, "verify-otp proxy failed");
    res.status(502).json({ success: false, error: "Network error. Try again." });
  }
});

export default router;
