"use client";
import { Suspense, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const sp = useSearchParams(); // <-- allowed because we're inside Suspense

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); return; }
    router.push(sp.get("redirectedFrom") || "/app");
  };

  return (
    <main className="container py-16">
      <div className="max-w-md mx-auto card">
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
        <form onSubmit={onLogin} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="btn w-full" type="submit">Entrar</button>
        </form>
        <p className="text-sm mt-4 text-gray-600">
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="container py-16">Cargando…</main>}>
      <LoginForm />
    </Suspense>
  );
}

// Avoid prerender issues on login
export const dynamic = "force-dynamic";
