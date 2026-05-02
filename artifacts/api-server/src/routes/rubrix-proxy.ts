import { Router } from "express";

const router = Router();

const RUBRIX_BASE = "https://backend.rubrix.ai/api";

// Proxy: Send OTP — GET /api/proxy/get-otp?userName=ROLLNO
router.get("/get-otp", async (req, res) => {
  const { userName } = req.query;
  if (!userName) {
    res.status(400).json({ error: "userName is required" });
    return;
  }
  try {
    const upstream = await fetch(
      `${RUBRIX_BASE}/my-account/get-otp?userName=${encodeURIComponent(String(userName))}`,
      { headers: { Accept: "application/json" } },
    );
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    req.log.error({ err }, "Rubrix get-otp proxy failed");
    res.status(502).json({ error: "Upstream request failed" });
  }
});

// Proxy: Validate OTP — GET /api/proxy/validate-otp?otp=XXXXXX&username=ROLLNO
router.get("/validate-otp", async (req, res) => {
  const { otp, username } = req.query;
  if (!otp || !username) {
    res.status(400).json({ error: "otp and username are required" });
    return;
  }
  try {
    const upstream = await fetch(
      `${RUBRIX_BASE}/my-account/validate-otp?otp=${encodeURIComponent(String(otp))}&username=${encodeURIComponent(String(username))}`,
      { headers: { Accept: "application/json" } },
    );
    const data = await upstream.json();
    // Forward the JWT from the Authorization response header
    const authHeader = upstream.headers.get("authorization");
    if (authHeader) {
      res.setHeader("x-rubrix-token", authHeader);
    }
    res.status(upstream.status).json(data);
  } catch (err) {
    req.log.error({ err }, "Rubrix validate-otp proxy failed");
    res.status(502).json({ error: "Upstream request failed" });
  }
});

// Proxy: Student account info — GET /api/proxy/student-info?identificationNo=ROLLNO
router.get("/student-info", async (req, res) => {
  const { identificationNo } = req.query;
  const authHeader = req.headers.authorization;
  if (!identificationNo || !authHeader) {
    res.status(400).json({ error: "identificationNo and Authorization header required" });
    return;
  }
  try {
    const upstream = await fetch(
      `${RUBRIX_BASE}/my-account/info?identificationNo=${encodeURIComponent(String(identificationNo))}`,
      { headers: { Accept: "application/json", Authorization: authHeader } },
    );
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    req.log.error({ err }, "Rubrix student-info proxy failed");
    res.status(502).json({ error: "Upstream request failed" });
  }
});

export default router;
