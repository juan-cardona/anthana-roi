"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function NewPortfolio({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    tipo_portafolio: "Conservador",
    moneda: "MXN",
    importe_inicial: 0,
    rendimiento_mensual_pct: 2,
    plazo_meses: 6,
    fecha_inicio: new Date().toISOString().slice(0,10),
    comision_retiro_pct: 5,
    retiro_rend_programado: true,
    periodicidad_rend: "Mensual",
    aportacion_mensual: 0
  });
  const [err, setErr] = useState<string|null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.from("portfolios").insert({
      client_id: params.id,
      ...form,
      aportaciones_extra: null,
      retiros_capital: null
    });
    if (error) { setErr(error.message); return; }
    router.push(`/app/clients/${params.id}`);
  };

  return (
    <main className="container py-8">
      <div className="max-w-2xl mx-auto card space-y-4">
        <h1 className="text-xl font-bold">Nueva cartera</h1>
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Nombre</label><input className="input" value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} required/></div>
          <div><label className="label">Tipo</label>
            <select className="input" value={form.tipo_portafolio} onChange={e=>setForm({...form, tipo_portafolio:e.target.value as any})}>
              <option>Conservador</option><option>Moderado</option><option>Agresivo</option>
            </select>
          </div>
          <div><label className="label">Importe inicial (MXN)</label><input className="input" type="number" value={form.importe_inicial} onChange={e=>setForm({...form, importe_inicial: Number(e.target.value)})}/></div>
          <div><label className="label">Rendimiento mensual %</label><input className="input" type="number" step="0.01" value={form.rendimiento_mensual_pct} onChange={e=>setForm({...form, rendimiento_mensual_pct: Number(e.target.value)})}/></div>
          <div><label className="label">Plazo (meses)</label><input className="input" type="number" value={form.plazo_meses} onChange={e=>setForm({...form, plazo_meses: Number(e.target.value)})}/></div>
          <div><label className="label">Fecha inicio</label><input className="input" type="date" value={form.fecha_inicio} onChange={e=>setForm({...form, fecha_inicio: e.target.value})}/></div>
          <div><label className="label">Comisión retiro %</label><input className="input" type="number" step="0.01" value={form.comision_retiro_pct} onChange={e=>setForm({...form, comision_retiro_pct: Number(e.target.value)})}/></div>
          <div><label className="label">Retirar rendimientos</label>
            <select className="input" value={form.retiro_rend_programado ? "Si":"No"} onChange={e=>setForm({...form, retiro_rend_programado: e.target.value==="Si"})}>
              <option>Si</option><option>No</option>
            </select>
          </div>
          <div><label className="label">Periodicidad</label>
            <select className="input" value={form.periodicidad_rend} onChange={e=>setForm({...form, periodicidad_rend: e.target.value as any})}>
              <option>Mensual</option><option>Trimestral</option>
            </select>
          </div>
          <div><label className="label">Aportación mensual</label><input className="input" type="number" value={form.aportacion_mensual} onChange={e=>setForm({...form, aportacion_mensual: Number(e.target.value)})}/></div>
          {err && <p className="text-red-600 text-sm col-span-2">{err}</p>}
          <div className="col-span-2"><button className="btn" type="submit">Guardar</button></div>
        </form>
      </div>
    </main>
  );
}
