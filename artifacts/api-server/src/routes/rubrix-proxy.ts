import { Router } from "express";

const router = Router();
const RUBRIX_BASE = "https://backend.rubrix.ai/api";

// POST /api/proxy/send-otp  { userName }
router.post("/send-otp", async (req, res) => {
  const userName = (req.body?.userName || req.query?.userName || "").toString().trim();
  if (!userName) { res.status(400).json({ success: false, error: "userName is required" }); return; }
  try {
    const up = await fetch(`${RUBRIX_BASE}/my-account/get-otp?userName=${encodeURIComponent(userName)}`, {
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

// POST /api/proxy/verify-otp  { userName, otp }
router.post("/verify-otp", async (req, res) => {
  const userName = (req.body?.userName || "").toString().trim();
  const otp     = (req.body?.otp     || "").toString().trim();
  if (!userName || !otp) { res.status(400).json({ success: false, error: "userName and otp are required" }); return; }
  try {
    const up = await fetch(
      `${RUBRIX_BASE}/my-account/validate-otp?otp=${encodeURIComponent(otp)}&username=${encodeURIComponent(userName)}`,
      { headers: { Accept: "application/json" } },
    );
    const data = await up.json() as Record<string, unknown>;

    // JWT lives in the response Authorization header
    const rawAuth = up.headers.get("authorization") || "";
    const token   = rawAuth.startsWith("Bearer ") ? rawAuth.slice(7) : rawAuth;

    if ((data.statusCode === "OK" || up.status === 200) && token) {
      // Fetch student profile with the fresh token
      let profile: Record<string, unknown> = {};
      try {
        const infoUp = await fetch(
          `${RUBRIX_BASE}/my-account/info?identificationNo=${encodeURIComponent(userName)}`,
          { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } },
        );
        const infoData = await infoUp.json() as Record<string, unknown>;
        const results  = infoData?.result as unknown[];
        if (Array.isArray(results) && results.length > 0) {
          profile = results[0] as Record<string, unknown>;
        }
      } catch (_) { /* profile stays empty; we still log the student in */ }

      res.json({ success: true, token, profile });
    } else {
      res.status(400).json({ success: false, error: "Incorrect OTP. Please try again." });
    }
  } catch (err) {
    req.log.error({ err }, "verify-otp proxy failed");
    res.status(502).json({ success: false, error: "Network error. Try again." });
  }
});

export default router;
