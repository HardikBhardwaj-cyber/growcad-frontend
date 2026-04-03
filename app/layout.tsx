import "./globals.css";

import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import Cursor from "@/components/ui/Cursor";

import { Inter } from "next/font/google";

/* ---------------- FONT ---------------- */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  metadataBase: new URL("https://growcad.in"), // change when live
};

/* ---------------- ROOT LAYOUT ---------------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0a0a0f] text-white antialiased overflow-x-hidden">

        <Providers>

          {/* 🔥 GLOBAL CURSOR (TOP LAYER) */}
          <div className="pointer-events-none fixed inset-0 z-9999">
            <Cursor />
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
                background: "rgba(15,23,42,0.9)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                borderRadius: "12px",
              },
            }}
          />

        </Providers>

      </body>
    </html>
  );
}