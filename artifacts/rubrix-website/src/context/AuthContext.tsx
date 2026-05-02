import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Student {
  rollNumber: string;
  identificationNo: string;
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
  imageUrl?: string;
  designation?: string;
  myPaths?: { career_path_ids?: string[]; skill_path_ids?: string[] };
  academicProgress?: {
    completedTopics?: string[];
    topicCompletionDetails?: {
      totalTopics?: number;
      completionPercentage?: number;
      collegeAvgPercent?: number;
    };
    lockedModules?: string[];
  };
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API  = `${BASE}/api/proxy`;

interface AuthState {
  isLoggedIn: boolean;
  student: Student | null;
  sendOTP:   (roll: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyOTP: (roll: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  isLoggedIn: false, student: null,
  sendOTP:   async () => ({ success: false }),
  verifyOTP: async () => ({ success: false }),
  logout: () => {},
});

function decodeJwt(token: string): Record<string, unknown> {
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return {}; }
}

function mapProfile(
  roll: string,
  profile: Record<string, unknown>,
  token: string,
  myPaths?: Record<string, unknown>,
  academicProgress?: Record<string, unknown>,
): Student {
  const firstName = String(profile.firstName || profile.first_name || "");
  const lastName  = String(profile.lastName  || profile.last_name  || "");
  const identificationNo = String(profile.identificationNo || `SPHN_STD_${roll}`);
  return {
    rollNumber:    roll,
    identificationNo,
    firstName,
    lastName,
    fullName:      [firstName, lastName].filter(Boolean).join(" ") || roll,
    email:         String(profile.personalMail  || profile.workMail || profile.personalEmail || ""),
    mobile:        String(profile.mobileNo      || profile.mobile   || ""),
    college:       String(profile.instituteName || profile.collegeName || profile.college || ""),
    branch:        String(profile.departmentName|| profile.branch   || profile.department  || ""),
    year:          String(profile.currentYear   || profile.year     || ""),
    semester:      String(profile.currentSem    || profile.semester || ""),
    batch:         String(profile.batchName     || profile.batch    || ""),
    section:       String(profile.section       || ""),
    cgpa:          String(profile.cgpa          || ""),
    imageUrl:      String(profile.imageUrl      || ""),
    designation:   String(profile.designation   || ""),
    token,
    myPaths:          (myPaths as Student["myPaths"]) || {},
    academicProgress: (academicProgress as Student["academicProgress"]) || {},
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [student,    setStudent]    = useState<Student | null>(null);

  useEffect(() => {
    localStorage.removeItem("rubrix_auth");
    localStorage.removeItem("rubrix_session");
    try {
      const raw = localStorage.getItem("dn_auth");
      if (!raw) return;
      const parsed: Student = JSON.parse(raw);
      const payload = decodeJwt(parsed.token);
      if (typeof payload.exp === "number" && Date.now() / 1000 > payload.exp) {
        localStorage.removeItem("dn_auth");
        return;
      }
      setStudent(parsed);
      setIsLoggedIn(true);
    } catch { /* ignore */ }
  }, []);

  async function sendOTP(roll: string) {
    try {
      const res  = await fetch(`${API}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: roll.trim().toUpperCase() }),
      });
      const data = await res.json();
      return data.success
        ? { success: true,  message: data.message }
        : { success: false, error: data.error || "Roll number not found." };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  async function verifyOTP(roll: string, otp: string) {
    try {
      const res  = await fetch(`${API}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: roll.trim().toUpperCase(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (!data.success || !data.token) {
        return { success: false, error: data.error || "Incorrect OTP. Please try again." };
      }
      const s = mapProfile(
        roll.trim().toUpperCase(),
        data.profile || {},
        data.token,
        data.myPaths,
        data.academicProgress,
      );
      setStudent(s);
      setIsLoggedIn(true);
      localStorage.setItem("dn_auth", JSON.stringify(s));
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  function logout() {
    setStudent(null);
    setIsLoggedIn(false);
    localStorage.removeItem("dn_auth");
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, student, sendOTP, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
