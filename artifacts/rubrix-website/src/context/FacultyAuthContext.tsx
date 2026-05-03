import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Faculty {
  code: string;
  name: string;
  role: string;
  department: string;
}

const FACULTY_CODES: Record<string, Omit<Faculty, "code">> = {
  "1234567890": { name: "Jashwanth Singh", role: "Admin · BigBrains", department: "CSE – Data Science" },
};

interface FacultyAuthState {
  isLoggedIn: boolean;
  faculty: Faculty | null;
  login:  (code: string) => { success: boolean; error?: string };
  logout: () => void;
}

const FacultyAuthContext = createContext<FacultyAuthState>({
  isLoggedIn: false, faculty: null,
  login: () => ({ success: false }),
  logout: () => {},
});

const STORAGE_KEY = "faculty_session";

export function FacultyAuthProvider({ children }: { children: ReactNode }) {
  const [faculty, setFaculty] = useState<Faculty | null>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as Faculty : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (faculty) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(faculty));
    else sessionStorage.removeItem(STORAGE_KEY);
  }, [faculty]);

  const login = (code: string): { success: boolean; error?: string } => {
    if (!/^\d{10}$/.test(code.trim())) {
      return { success: false, error: "Enter a valid 10-digit faculty code." };
    }
    const meta = FACULTY_CODES[code.trim()];
    if (!meta) {
      return { success: false, error: "Invalid faculty code. Please contact your administrator." };
    }
    setFaculty({ code: code.trim(), ...meta });
    return { success: true };
  };

  const logout = () => setFaculty(null);

  return (
    <FacultyAuthContext.Provider value={{ isLoggedIn: !!faculty, faculty, login, logout }}>
      {children}
    </FacultyAuthContext.Provider>
  );
}

export function useFacultyAuth() { return useContext(FacultyAuthContext); }
