import type { IncomingMessage, ServerResponse } from "http";

const LEETCODE_GQL = "https://leetcode.com/graphql";

const QUERY = `
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    total: totalNum
    questions: data {
      acRate
      difficulty
      frontendQuestionId: questionFrontendId
      paidOnly: isPaidOnly
      title
      titleSlug
      topicTags { name slug }
    }
  }
}`;

function json(res: ServerResponse, status: number, data: unknown) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

export default async function handler(req: IncomingMessage & { query?: Record<string, string | string[]> }, res: ServerResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.statusCode = 204;
    res.end();
    return;
  }

  const qs = req.query ?? {};
  const skip   = parseInt(String(qs.skip ?? "0"), 10)   || 0;
  const limit  = parseInt(String(qs.limit ?? "50"), 10) || 50;
  const diff   = String(qs.difficulty ?? "").toUpperCase();
  const search = String(qs.search ?? "");

  const filters: Record<string, unknown> = {};
  if (diff && ["EASY", "MEDIUM", "HARD"].includes(diff)) filters.difficulty = diff;
  if (search) filters.searchKeywords = search;

  try {
    const up = await fetch(LEETCODE_GQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer":      "https://leetcode.com/problemset/",
        "Origin":       "https://leetcode.com",
        "User-Agent":   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { categorySlug: "", limit, skip, filters },
      }),
    });

    if (!up.ok) {
      json(res, 502, { error: "LeetCode API error", status: up.status });
      return;
    }

    const data = await up.json() as { data?: { problemsetQuestionList?: unknown } };
    json(res, 200, data?.data?.problemsetQuestionList ?? { total: 0, questions: [] });
  } catch (err) {
    console.error("LeetCode problems proxy error", err);
    json(res, 502, { error: "Failed to reach LeetCode" });
  }
}
