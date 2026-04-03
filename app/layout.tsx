

import "./globals.css";

import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import Cursor from "@/components/ui/Cursor";

import { Inter } from "next/font/google";
import { useEffect } from "react";

/* ---------------- FONT ---------------- */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // ✅ better performance
});

/* ---------------- METADATA ---------------- */

export const metadata = {
  title: {
    default: "GROWCAD – Growth OS for Coaching Institutes",
    template: "%s | GROWCAD",
  },
  description:
    "Automate admissions, manage students, and scale your coaching institute with GROWCAD.",
  keywords: [
    "coaching management software",
    "institute CRM",
    "student management system",
    "Growcad",
  ],
  metadataBase: new URL("https://growcad.in"),
};

/* ---------------- ROOT LAYOUT ---------------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔥 Prevent scroll flicker (Lenis compatibility)
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";
  }, []);

  return (
    <html lang="en" className={inter.variable}>
      <body
        className="
          bg-[#0a0a0f] text-white antialiased overflow-x-hidden
          selection:bg-purple-500/30 selection:text-white
        "
      >
        <Providers>
          {/* 🔥 GLOBAL CURSOR (TOP LAYER) */}
          <div className="pointer-events-none fixed inset-0 z-[9999]">
            <Cursor />
          </div>

          {/* 🔥 GLOBAL NOISE + GRADIENT OVERLAY (Pulz-level depth) */}
          <div className="pointer-events-none fixed inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.15),transparent_40%)]" />
            <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />
          </div>

          {/* 🔥 MAIN APP */}
          <main className="relative z-10">
            {children}
          </main>

          {/* 🔥 TOASTER (PREMIUM STYLE) */}
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                background: "rgba(15,23,42,0.85)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderRadius: "14px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}