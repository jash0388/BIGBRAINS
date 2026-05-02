import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Student {
  rollNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  mobile: string;
  college: string;
  branch: string;
  year: string;
  semester: string;
  batch: string;
  section: string;
  cgpa: string;
  token: string;
}

function parseJwt(token: string): Record<string, unknown> {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

// BASE_PATH of our API server proxy
const API_BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/api/proxy`.replace(/\/\//g, "/");

interface AuthState {
  isLoggedIn: boolean;
  student: Student | null;
  sendOTP: (roll: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyOTP: (roll: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  student: null,
  sendOTP: async () => ({ success: false }),
  verifyOTP: async () => ({ success: false }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rubrix_auth");
      if (saved) {
        const parsed: Student = JSON.parse(saved);
        // Check if token has expired
        const payload = parseJwt(parsed.token);
        const exp = payload.exp as number | undefined;
        if (exp && Date.now() / 1000 > exp) {
          localStorage.removeItem("rubrix_auth");
          return;
        }
        setStudent(parsed);
        setIsLoggedIn(true);
      }
    } catch {}
  }, []);

  async function sendOTP(roll: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const userName = roll.trim().toUpperCase();
    try {
      const res = await fetch(`${API_BASE}/get-otp?userName=${encodeURIComponent(userName)}`);
      const data = await res.json();
      if (data.status === "Success" && data.result === "OK") {
        return { success: true, message: data.description };
      }
      return { success: false, error: data.description || "Roll number not found. Please check and try again." };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  async function verifyOTP(roll: string, otp: string): Promise<{ success: boolean; error?: string }> {
    const username = roll.trim().toUpperCase();
    try {
      const res = await fetch(
        `${API_BASE}/validate-otp?otp=${encodeURIComponent(otp.trim())}&username=${encodeURIComponent(username)}`
      );
      const data = await res.json();

      if (data.statusCode !== "OK") {
        return { success: false, error: "Incorrect OTP. Please try again." };
      }

      // JWT comes in our custom forwarded header
      const rawAuth = res.headers.get("x-rubrix-token");
      const token = rawAuth ? rawAuth.replace(/^Bearer\s+/i, "") : "";
      if (!token) {
        return { success: false, error: "Login failed. Please try again." };
      }

      // Fetch real student info
      const infoRes = await fetch(
        `${API_BASE}/student-info?identificationNo=${encodeURIComponent(username)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const infoData = await infoRes.json();
      const info = infoData?.result?.[0];

      const s: Student = {
        rollNumber: username,
        firstName: info?.firstName || username,
        lastName: info?.lastName || "",
        fullName: info ? `${info.firstName || ""} ${info.lastName || ""}`.trim() : username,
        email: info?.personalMail || info?.workMail || "",
        mobile: info?.mobileNo || "",
        college: info?.instituteName || "Your Institution",
        branch: info?.departmentName || "Engineering",
        year: info?.currentYear || "",
        semester: info?.currentSem || "",
        batch: info?.batchName || "",
        section: info?.section || "",
        cgpa: info?.cgpa || "",
        token,
      };

      setStudent(s);
      setIsLoggedIn(true);
      localStorage.setItem("rubrix_auth", JSON.stringify(s));
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  function logout() {
    setStudent(null);
    setIsLoggedIn(false);
    localStorage.removeItem("rubrix_auth");
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, student, sendOTP, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
