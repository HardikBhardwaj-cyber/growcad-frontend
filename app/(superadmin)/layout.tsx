"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();

  const nav = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Tenants", href: "/tenants" },
  ];

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 p-6 border-r border-white/10">
        <h2 className="text-xl font-bold mb-6 gradient-text">
          Super Admin
        </h2>

        <nav className="flex flex-col gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg ${
                path === item.href
                  ? "bg-purple-600/20"
                  : "text-gray-400"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}