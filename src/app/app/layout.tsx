import React from "react";
import Link from "next/link";
import { getSessionOrRedirect } from "@/lib/auth";
import Breadcrumbs from "./_components/Breadcrumbs";
import SignOutButton from "./_components/SignOutButton";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="px-3 py-2 rounded hover:bg-gray-100">
      {children}
    </Link>
  );
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await getSessionOrRedirect();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-40">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <Link href="/app" className="font-semibold">ROI</Link>
            <nav className="hidden md:flex items-center gap-1 text-sm text-gray-700">
              <NavLink href="/app">Panel</NavLink>
              <NavLink href="/app/clients">Clientes</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Breadcrumbs />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}


