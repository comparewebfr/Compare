/**
 * Client Supabase réutilisable
 * Variables : NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (.env.local)
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/** Client Supabase (browser ou server). Retourne null si non configuré. */
export function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

/** Vérifie si Supabase est configuré */
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
