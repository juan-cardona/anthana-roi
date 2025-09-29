import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase/server";

export async function getSessionOrRedirect(to: string = "/login") {
  const supabase = supabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect(to);
  return session;
}
