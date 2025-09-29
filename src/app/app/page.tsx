import Link from "next/link";
import { getSessionOrRedirect } from "@/lib/auth";

export default async function AppHome() {
  await getSessionOrRedirect();
  return (
    <main className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel</h1>
        <div className="flex gap-3">
          <Link className="btn" href="/app/clients">Clientes</Link>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">Capital inicial <div className="text-2xl font-semibold">$ —</div></div>
        <div className="card">Rendimientos netos <div className="text-2xl font-semibold">$ —</div></div>
        <div className="card">Capital final <div className="text-2xl font-semibold">$ —</div></div>
      </div>
    </main>
  );
}
