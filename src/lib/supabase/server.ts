import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export function supabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          // Return all cookies as an array of { name, value }
          return Array.from(cookieStore.getAll()).map(([name, cookie]) => ({
            name,
            value: cookie.value,
          }));
        },
        async setAll(cookies) {
          // Set all cookies provided in the array
          for (const { name, value, options } of cookies) {
            cookieStore.set({ name, value, ...options });
          }
        },
      },
    }
  );
}
