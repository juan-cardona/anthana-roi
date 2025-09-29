import Link from "next/link";

export default function Landing() {
  return (
    <main className="container py-16">
      <div className="max-w-3xl mx-auto card space-y-6 text-center">
        <h1 className="text-3xl font-bold">Simulador & Dashboard de Inversiones</h1>
        <p className="text-gray-600">
          App interna para capturar carteras, calcular rendimientos y mostrar crecimiento a clientes.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login" className="btn">Entrar</Link>
        </div>
      </div>
    </main>
  );
}
