import { supabaseServer } from "@/lib/supabase/server";
import { getSessionOrRedirect } from "@/lib/auth";
import Link from "next/link";

export const revalidate = 0;

export default async function ClientsPage() {
  await getSessionOrRedirect();
  const supabase = supabaseServer();
  const { data: clients } = await supabase.from("clients").select("*").order("created_at", { ascending: false });

  return (
    <main className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Link href="/app/clients/new" className="btn">Nuevo cliente</Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(clients || []).map((c:any) => (
          <Link key={c.id} href={`/app/clients/${c.id}`} className="card hover:shadow-md transition">
            <div className="text-lg font-semibold">{c.nombre}</div>
            <div className="text-sm text-gray-600">{c.email || "—"}</div>
            <div className="mt-2 text-xs text-gray-500">Ver detalle →</div>
          </Link>
        ))}
        {(!clients || clients.length===0) && <div className="text-gray-600">No hay clientes aún.</div>}
      </div>
    </main>
  );
}
