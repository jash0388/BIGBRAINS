import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "./logger";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _supabase: SupabaseClient | null = null;

if (!url || !key) {
  logger.warn(
    "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — database routes will be unavailable"
  );
} else {
  _supabase = createClient(url, key);
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabase) {
      // Return a function that always resolves to an error so callers don't crash
      return () => Promise.resolve({ data: null, error: { message: "Supabase not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY" } });
    }
    const val = (_supabase as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? val.bind(_supabase) : val;
  },
});
