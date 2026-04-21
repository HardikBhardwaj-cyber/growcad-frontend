// app/(dashboard)/ai/page.tsx

export const dynamic = "force-dynamic"; // ✅ REQUIRED FIX

import { Suspense } from "react";
import AIClient from "./AIClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Loading AI...</div>}>
      <AIClient />
    </Suspense>
  );
}