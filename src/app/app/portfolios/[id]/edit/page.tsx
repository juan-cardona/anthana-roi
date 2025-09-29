"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function EditPortfolio({ params }: { params: { id: string } }) {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [err, setErr] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("portfolios").select("*").eq("id", params.id).single();
      if (error) setErr(error.message);
      else setForm(data);
    })();
  }, [params.id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const { error } = await supabase.from("portfolios").update(form).eq("id", params.id);
    if (error) { setErr(error.message); return; }
    router.back();
  };

  if (!form) return <main className="container py-8">Cargando...</main>;

  return (
    <main className="container py-8">
      <div className="max-w-2xl mx-auto card space-y-4">
        <h1 className="text-xl font-bold">Editar cartera</h1>
        <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Nombre</label><input className="input" value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} required/></div>
          <div><label className="label">Tipo</label>
            <select className="input" value={form.tipo_portafolio} onChange={e=>setForm({...form, tipo_portafolio:e.target.value})}>
              <option>Conservador</option><option>Moderado</option><option>Agresivo</option>
            </select>
          </div>
          <div><label className="label">Importe inicial</label><input className="input" type="number" value={form.importe_inicial} onChange={e=>setForm({...form, importe_inicial:Number(e.target.value)})}/></div>
          <div><label className="label">Rendimiento mensual %</label><input className="input" type="number" step="0.01" value={form.rendimiento_mensual_pct} onChange={e=>setForm({...form, rendimiento_mensual_pct:Number(e.target.value)})}/></div>
          <div><label className="label">Plazo (meses)</label><input className="input" type="number" value={form.plazo_meses} onChange={e=>setForm({...form, plazo_meses:Number(e.target.value)})}/></div>
          <div><label className="label">Fecha inicio</label><input className="input" type="date" value={form.fecha_inicio} onChange={e=>setForm({...form, fecha_inicio:e.target.value})}/></div>
          <div><label className="label">Comisión retiro %</label><input className="input" type="number" step="0.01" value={form.comision_retiro_pct} onChange={e=>setForm({...form, comision_retiro_pct:Number(e.target.value)})}/></div>
          <div><label className="label">Retirar rendimientos</label>
            <select className="input" value={form.retiro_rend_programado ? "Si":"No"} onChange={e=>setForm({...form, retiro_rend_programado:e.target.value==="Si"})}>
              <option>Si</option><option>No</option>
            </select>
          </div>
          <div><label className="label">Periodicidad</label>
            <select className="input" value={form.periodicidad_rend} onChange={e=>setForm({...form, periodicidad_rend:e.target.value})}>
              <option>Mensual</option><option>Trimestral</option>
            </select>
          </div>
          <div><label className="label">Aportación mensual</label><input className="input" type="number" value={form.aportacion_mensual||0} onChange={e=>setForm({...form, aportacion_mensual:Number(e.target.value)})}/></div>
          {err && <p className="text-red-600 text-sm col-span-2">{err}</p>}
          <div className="col-span-2"><button className="btn" type="submit">Guardar</button></div>
        </form>
      </div>
    </main>
  );
}
