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
      <body>
        <SplashIntro />
        <Providers>
          <Cursor />
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}