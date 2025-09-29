"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const parts = (pathname || "/").split("/").filter(Boolean);
  const acc: { href: string; label: string }[] = [];
  parts.reduce((prev, curr) => {
    const href = `${prev}/${curr}`;
    acc.push({ href, label: decodeURIComponent(curr) });
    return href;
  }, "");

  if (acc.length <= 1) return null;
  return (
    <nav className="hidden md:flex items-center text-xs text-gray-500">
      {acc.map((p, i) => (
        <span key={p.href} className={classNames("flex items-center", i > 0 && "before:content-['/'] before:mx-2 before:text-gray-300")}>
          <Link href={p.href} className={classNames(i === acc.length - 1 ? "text-gray-900" : "hover:underline")}>{p.label}</Link>
        </span>
      ))}
    </nav>
  );
}


