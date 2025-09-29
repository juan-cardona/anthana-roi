"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); return; }
    router.push("/login");
  };

  return (
    <main className="container py-16">
      <div className="max-w-md mx-auto card">
        <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
        <form onSubmit={onRegister} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="btn w-full" type="submit">Registrarme</button>
        </form>
      </div>
    </main>
  );
}
