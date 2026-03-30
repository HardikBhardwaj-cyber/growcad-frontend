"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 p-6 border-r border-white/10 hidden md:block">
      <h2 className="text-xl font-bold mb-6">Growcad</h2>

      <nav className="flex flex-col gap-3 text-sm">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/students">Students</Link>
        <Link href="/attendance">Attendance</Link>
        <Link href="/fees">Fees</Link>
      </nav>
    </aside>
  );
}