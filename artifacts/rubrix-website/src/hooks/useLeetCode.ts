import { useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API  = `${BASE}/api/leetcode`;

export interface LCProblem {
  frontendQuestionId: string;
  title:      string;
  titleSlug:  string;
  difficulty: "Easy" | "Medium" | "Hard";
  acRate:     number;
  paidOnly:   boolean;
  topicTags:  { name: string; slug: string }[];
}

export interface LCProblemsResult {
  total:     number;
  questions: LCProblem[];
}

export interface LCSubmit {
  id:        string;
  title:     string;
  titleSlug: string;
  timestamp: string;
}

export interface LCUserStats {
  matchedUser: {
    username: string;
    profile: {
      ranking:     number;
      userAvatar?: string;
      realName?:   string;
      countryName?: string;
      school?:     string;
      company?:    string;
      skillTags?:  string[];
    };
    submitStats: {
      acSubmissionNum: { difficulty: string; count: number; submissions: number }[];
      totalSubmissionNum: { difficulty: string; count: number; submissions: number }[];
    };
    badges?:      { id: string; displayName: string; icon: string }[];
    activeBadge?: { displayName: string; icon: string } | null;
    userCalendar?: { streak: number; totalActiveDays: number };
  } | null;
  recentAcSubmissionList: LCSubmit[];
}

export function useLCProblems(params: { skip?: number; limit?: number; difficulty?: string; search?: string }) {
  const [data,    setData]    = useState<LCProblemsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const qs = new URLSearchParams();
    if (params.skip)       qs.set("skip",       String(params.skip));
    if (params.limit)      qs.set("limit",      String(params.limit));
    if (params.difficulty && params.difficulty !== "All") qs.set("difficulty", params.difficulty.toUpperCase());
    if (params.search)     qs.set("search",     params.search);

    fetch(`${API}/problems?${qs}`)
      .then(r => r.json())
      .then((d: LCProblemsResult) => { setData(d); setLoading(false); })
      .catch(() => { setError("Failed to load LeetCode problems"); setLoading(false); });
  }, [params.skip, params.limit, params.difficulty, params.search]);

  return { data, loading, error };
}

export async function fetchLCUser(username: string): Promise<LCUserStats | null> {
  try {
    const res = await fetch(`${API}/user/${encodeURIComponent(username)}`);
    if (!res.ok) return null;
    return res.json() as Promise<LCUserStats>;
  } catch { return null; }
}
