import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export type Backend = "main" | "node" | "python" | "assessments";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function rubrixUrl(backend: Backend, path: string) {
  return `${BASE}/api/proxy/${backend}${path}`;
}

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
  /** If true, skip fetch (used for public endpoints that don't need auth) */
  requireAuth?: boolean;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRubrixData<T>(
  backend: Backend,
  path: string,
  enabled = true,
  opts: FetchOptions = {},
): FetchState<T> {
  const { student } = useAuth();
  const { method = "GET", body, requireAuth = true } = opts;

  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Skip if auth required but no token yet
    if (requireAuth && !student?.token) return;
    if (!enabled) return;

    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      if (student?.token) headers.Authorization = `Bearer ${student.token}`;
      if (method !== "GET") headers["Content-Type"] = "application/json";

      const res = await fetch(rubrixUrl(backend, path), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, [student?.token, backend, path, enabled, method, JSON.stringify(body), requireAuth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
