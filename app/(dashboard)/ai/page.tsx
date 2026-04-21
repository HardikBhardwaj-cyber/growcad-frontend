// app/(dashboard)/ai/page.tsx

import dynamic from "next/dynamic";

const AIClient = dynamic(() => import("./AIClient"), {
  ssr: false, // 🔥 THIS LINE FIXES YOUR ERROR
});

export default function Page() {
  return <AIClient />;
}