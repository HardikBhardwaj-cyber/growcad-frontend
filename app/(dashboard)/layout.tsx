"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  const nav = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Students", href: "/students" },
    { name: "Attendance", href: "/attendance" },
    { name: "Fees", href: "/fees" },
  ];

  return (
    <div className="flex min-h-screen">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black p-4 flex justify-between z-50">
        <h2>Growcad</h2>
        <button onClick={() => setOpen(!open)}>☰</button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-black p-6 z-40 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="text-xl mb-6">Growcad</h2>

        <nav className="flex flex-col gap-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`${
                path === item.href
                  ? "text-white"
                  : "text-gray-400"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
}