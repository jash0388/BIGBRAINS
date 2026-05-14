import type { IncomingMessage, ServerResponse } from "http";

const LEETCODE_GQL = "https://leetcode.com/graphql";

const PROFILE_QUERY = `
query userStats($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      ranking
      userAvatar
      realName
      countryName
      school
      company
      jobTitle
      skillTags
    }
    submitStats {
      acSubmissionNum { difficulty count submissions }
      totalSubmissionNum { difficulty count submissions }
    }
    badges { id displayName icon }
    activeBadge { displayName icon }
    userCalendar { streak totalActiveDays }
  }
  recentAcSubmissionList(username: $username, limit: 15) {
    id title titleSlug timestamp
  }
}`;

function json(res: ServerResponse, status: number, data: unknown) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

export default async function handler(
  req: IncomingMessage & { query?: Record<string, string | string[]> },
  res: ServerResponse,
) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.statusCode = 204;
    res.end();
    return;
  }

  const pathParam = req.query?.username;
  const username  = Array.isArray(pathParam) ? pathParam[0] : pathParam;

  if (!username) {
    json(res, 400, { error: "username is required" });
    return;
  }

  try {
    const up = await fetch(LEETCODE_GQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer":      `https://leetcode.com/${username}/`,
        "Origin":       "https://leetcode.com",
        "User-Agent":   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      body: JSON.stringify({ query: PROFILE_QUERY, variables: { username } }),
    });

    if (!up.ok) {
      json(res, 502, { error: "LeetCode API error", status: up.status });
      return;
    }

    const data = await up.json() as { data?: unknown; errors?: unknown };
    if (data.errors) {
      json(res, 404, { error: "User not found or private profile" });
      return;
    }
    json(res, 200, data.data ?? {});
  } catch (err) {
    console.error("LeetCode user proxy error", err);
    json(res, 502, { error: "Failed to reach LeetCode" });
  }
}
