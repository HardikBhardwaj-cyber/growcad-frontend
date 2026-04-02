import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import Cursor from "@/components/ui/Cursor";

export const metadata = {
  title: "GROWCAD – Growth OS for Coaching Institutes",
  description:
    "Automate admissions, manage students, and scale your coaching institute with GROWCAD.",
  keywords: [
    "coaching management software",
    "institute CRM",
    "student management system",
    "Growcad",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-white antialiased overflow-x-hidden">

        <Providers>

          {/* 🔥 GLOBAL CURSOR (TOP LAYER) */}
          <div className="pointer-events-none fixed inset-0 z-[9999]">
            <Cursor />
          </div>

          {/* 🔥 MAIN APP */}
          <div className="relative z-10">
            {children}
          </div>

          {/* 🔥 TOAST SYSTEM */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(15,23,42,0.9)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              },
            }}
          />

        </Providers>

      </body>
    </html>
  );
}