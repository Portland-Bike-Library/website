import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  throw new Error(
    "Supabase env vars missing. Set SUPABASE_URL and SUPABASE_SECRET_KEY."
  );
}

// Server-side client. Bypasses RLS — never import this in client components.
export const supabaseAdmin = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
