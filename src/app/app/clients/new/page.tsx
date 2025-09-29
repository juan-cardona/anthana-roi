"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NewClient() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", notas: "" });
  const [err, setErr] = useState<string|null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.from("clients").insert({
      nombre: form.nombre,
      email: form.email || null,
      telefono: form.telefono || null,
      notas: form.notas || null
    });
    if (error) { setErr(error.message); return; }
    router.push("/app/clients");
  };

  return (
    <main className="container py-8">
      <div className="max-w-xl mx-auto card space-y-4">
        <h1 className="text-xl font-bold">Nuevo cliente</h1>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label">Nombre</label><input className="input" value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} required/></div>
          <div><label className="label">Email</label><input className="input" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/></div>
          <div><label className="label">Teléfono</label><input className="input" value={form.telefono} onChange={e=>setForm({...form, telefono:e.target.value})}/></div>
          <div><label className="label">Notas</label><textarea className="input" value={form.notas} onChange={e=>setForm({...form, notas:e.target.value})}/></div>
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button className="btn" type="submit">Guardar</button>
        </form>
      </div>
    </main>
  );
}
