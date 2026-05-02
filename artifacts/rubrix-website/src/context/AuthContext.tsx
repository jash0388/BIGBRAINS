import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Student {
  rollNumber: string;
  name: string;
  college: string;
  branch: string;
  year: string;
  semester: string;
  batch: string;
}

const KNOWN_STUDENTS: Record<string, Student> = {
  "24N81A6758": {
    rollNumber: "24N81A6758",
    name: "NEANAVTH JASHWANTH SINGH",
    college: "Sphoorthy Engineering College (UGC Autonomous)",
    branch: "B.Tech – Computer Science & Engineering (Data Science)",
    year: "2nd Year",
    semester: "IV",
    batch: "2024-2028",
  },
};

interface AuthState {
  isLoggedIn: boolean;
  student: Student | null;
  login: (roll: string, otp: string) => { success: boolean; error?: string };
  logout: () => void;
  sendOTP: (roll: string) => { success: boolean; otp?: string; error?: string };
}

const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  student: null,
  login: () => ({ success: false }),
  logout: () => {},
  sendOTP: () => ({ success: false }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [pendingOTP, setPendingOTP] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem("rubrix_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStudent(parsed);
        setIsLoggedIn(true);
      } catch {}
    }
  }, []);

  function sendOTP(roll: string): { success: boolean; otp?: string; error?: string } {
    const r = roll.trim().toUpperCase();
    const st = KNOWN_STUDENTS[r];
    if (!st) {
      return { success: false, error: "Roll number not found. Please check and try again." };
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setPendingOTP((prev) => ({ ...prev, [r]: otp }));
    return { success: true, otp };
  }

  function login(roll: string, otp: string): { success: boolean; error?: string } {
    const r = roll.trim().toUpperCase();
    const st = KNOWN_STUDENTS[r];
    if (!st) return { success: false, error: "Roll number not found." };
    const expected = pendingOTP[r];
    if (!expected) return { success: false, error: "Please request an OTP first." };
    if (otp.trim() !== expected) return { success: false, error: "Incorrect OTP. Please try again." };
    setStudent(st);
    setIsLoggedIn(true);
    localStorage.setItem("rubrix_session", JSON.stringify(st));
    return { success: true };
  }

  function logout() {
    setStudent(null);
    setIsLoggedIn(false);
    setPendingOTP({});
    localStorage.removeItem("rubrix_session");
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, student, login, logout, sendOTP }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
