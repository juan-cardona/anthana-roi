import { supabaseServer } from "@/lib/supabase/server";
import { getSessionOrRedirect } from "@/lib/auth";
import Link from "next/link";
import { computeMonthly } from "@/lib/calc";

export const revalidate = 0;

export default async function ClientDetail({ params }: { params: { id: string } }) {
  await getSessionOrRedirect();
  const supabase = supabaseServer();
  const { data: client } = await supabase.from("clients").select("*").eq("id", params.id).single();
  const { data: portfolios } = await supabase.from("portfolios").select("*").eq("client_id", params.id).order("created_at", { ascending: false });

  return (
    <main className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{client?.nombre || "Cliente"}</h1>
        <Link href={`/app/clients/${params.id}/portfolios/new`} className="btn">Nueva cartera</Link>
      </div>

      <div className="grid gap-4">
        {(portfolios || []).map((p:any) => {
          const { rows, kpis } = computeMonthly(p);
          return (
            <div key={p.id} className="card space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{p.nombre} • {p.tipo_portafolio}</div>
                <Link className="text-sm" href={`/app/portfolios/${p.id}/edit`}>Editar</Link>
              </div>
              <div className="text-sm text-gray-600">Capital final estimado: ${kpis.capital_final.toFixed(2)}</div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="p-2">Mes</th>
                      <th className="p-2">Fecha</th>
                      <th className="p-2">Capital</th>
                      <th className="p-2">Aportación</th>
                      <th className="p-2">Rendimiento</th>
                      <th className="p-2">Retiro rend.</th>
                      <th className="p-2">Comisión</th>
                      <th className="p-2">Retiro capital</th>
                      <th className="p-2">Capital final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={r.mes} className="border-t">
                        <td className="p-2">{r.mes}</td>
                        <td className="p-2">{r.fecha}</td>
                        <td className="p-2">{r.capital_inicial.toFixed(2)}</td>
                        <td className="p-2">{r.aportacion_mensual.toFixed(2)}</td>
                        <td className="p-2">{r.rendimiento_mx.toFixed(2)}</td>
                        <td className="p-2">{r.retiro_rend.toFixed(2)}</td>
                        <td className="p-2">{r.comision_retiro.toFixed(2)}</td>
                        <td className="p-2">{r.retiro_capital.toFixed(2)}</td>
                        <td className="p-2">{r.capital_final.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
        {(!portfolios || portfolios.length===0) && <div className="text-gray-600">Aún no hay carteras.</div>}
      </div>
    </main>
  );
}
