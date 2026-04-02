import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import Cursor from "@/components/ui/Cursor";
import SplashIntro from "./(marketing)/components/hero/SplashIntro";

export const metadata = {
  title: "Growcad",
  description: "Growth OS for Coaching Institutes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-white antialiased">

        <Providers>

          {/* 🔥 SPLASH ONLY ON FIRST LOAD */}
          <SplashIntro />

          {/* 🔥 CURSOR SYSTEM */}
          <Cursor />

          {/* 🔥 MAIN APP */}
          <div className="relative">
            {children}
          </div>

          {/* 🔥 TOAST */}
          <Toaster position="top-right" />

        </Providers>

      </body>
    </html>
  );
}