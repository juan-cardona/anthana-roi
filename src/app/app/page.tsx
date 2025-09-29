import Link from "next/link";
import { getSessionOrRedirect } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { computeMonthly } from "@/lib/calc";

export default async function AppHome() {
  await getSessionOrRedirect();
  const supabase = supabaseServer();
  const { data: portfolios } = await supabase.from("portfolios").select("*").order("created_at", { ascending: false });

  const aggregates = (portfolios || []).reduce(
    (acc: any, p: any) => {
      const { rows, kpis } = computeMonthly(p as any);
      acc.capitalInicial += kpis.capital_inicial_total || 0;
      acc.rendNeto += kpis.rend_neto || 0;
      acc.capitalFinal += kpis.capital_final || 0;
      // collect last 12 points for sparkline
      const last = rows.slice(-12).map(r => r.capital_final);
      acc.series.push(last);
      return acc;
    },
    { capitalInicial: 0, rendNeto: 0, capitalFinal: 0, series: [] as number[][] }
  );

  const mergedSpark = (() => {
    if (aggregates.series.length === 0) return [] as number[];
    const maxLen = Math.max(...aggregates.series.map(s => s.length));
    const padded = aggregates.series.map(s => Array.from({ length: maxLen }, (_, i) => s[s.length - maxLen + i] ?? s[0] ?? 0));
    return padded[0].map((_, i) => padded.reduce((sum, s) => sum + (s[i] || 0), 0));
  })();

  function formatCurrency(n: number) {
    return n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
  }

  return (
    <main className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel</h1>
        <div className="flex gap-3">
          <Link className="btn" href="/app/clients">Clientes</Link>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">Capital inicial <div className="text-2xl font-semibold">{formatCurrency(aggregates.capitalInicial)}</div></div>
        <div className="card">Rendimientos netos <div className="text-2xl font-semibold">{formatCurrency(aggregates.rendNeto)}</div></div>
        <div className="card">Capital final <div className="text-2xl font-semibold">{formatCurrency(aggregates.capitalFinal)}</div></div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">Tendencia de capital (12 meses)</div>
          <Link href="/app/clients" className="text-sm">Ver clientes →</Link>
        </div>
        <Sparkline data={mergedSpark} />
      </div>
    </main>
  );
}

function Sparkline({ data }: { data: number[] }) {
  if (!data || data.length === 0) return <div className="text-sm text-gray-500">Sin datos</div>;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const width = 600;
  const height = 120;
  const pad = 6;
  const norm = (v: number) => {
    if (max === min) return height / 2;
    return pad + (1 - (v - min) / (max - min)) * (height - pad * 2);
  };
  const step = (width - pad * 2) / Math.max(1, data.length - 1);
  const d = data
    .map((v, i) => `${i === 0 ? "M" : "L"}${pad + i * step},${norm(v)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
      <path d={d} fill="none" stroke="#0ea5e9" strokeWidth="2" />
    </svg>
  );
}
