"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { createTenant, checkSubdomain } from "@/modules/tenant/api";
import { api } from "@/lib/api";

const invalidSubdomains = ["www", "admin", "api"];

export default function Onboarding() {
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [available, setAvailable] = useState<boolean | null>(null);

  const [data, setData] = useState({
    name: "",
    subdomain: "",
    plan: "basic",
  });

  // 🔥 CHECK SUBDOMAIN
  const checkAvailability = async (value: string) => {
    try {
      const res = await checkSubdomain(value);
      setAvailable(res.available);
    } catch {}
  };

  // 🔥 STEP 1 VALIDATION
  const handleNext = () => {
    if (!data.name || !data.subdomain) {
      alert("Please fill all fields");
      return;
    }

    if (invalidSubdomains.includes(data.subdomain)) {
      alert("Invalid subdomain");
      return;
    }

    if (available === false) {
      alert("Subdomain already taken");
      return;
    }

    setStep(2);
  };

  // 🔥 FINAL SUBMIT
  const handleSubmit = async () => {
    try {
      setLoading(true);

      await createTenant(data);

      // 🔥 analytics hook
      await api.post("/analytics/onboarded");

      window.location.href = `https://${data.subdomain}.growcad.in/dashboard`;
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass p-8 rounded-2xl w-full max-w-md">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-xl mb-4">Institute Info</h2>

            <input
              placeholder="Institute Name"
              value={data.name}
              onChange={(e) =>
                setData({ ...data, name: e.target.value })
              }
              className="w-full p-3 mb-4 border rounded-xl bg-transparent"
            />

            <input
              placeholder="Subdomain (yourname)"
              value={data.subdomain}
              onChange={(e) => {
                const value = e.target.value.toLowerCase();

                setData({ ...data, subdomain: value });

                checkAvailability(value);
              }}
              className="w-full p-3 mb-2 border rounded-xl bg-transparent"
            />

            {/* 🔥 AVAILABILITY */}
            {available === true && (
              <p className="text-green-400 text-sm">
                ✔ Available
              </p>
            )}

            {available === false && (
              <p className="text-red-400 text-sm">
                ❌ Already taken
              </p>
            )}

            <Button className="mt-4" onClick={handleNext}>
              Continue
            </Button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-xl mb-4">Choose Plan</h2>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {["basic", "academic", "advanced"].map((p) => (
                <div
                  key={p}
                  onClick={() =>
                    setData({ ...data, plan: p })
                  }
                  className={`p-4 rounded-xl border cursor-pointer text-center capitalize ${
                    data.plan === p
                      ? "border-purple-500 glow"
                      : "border-white/10"
                  }`}
                >
                  {p}
                </div>
              ))}
            </div>

            <Button onClick={() => setStep(3)}>
              Continue
            </Button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-xl mb-4">
              You are Ready 🚀
            </h2>

            <Button loading={loading} onClick={handleSubmit}>
              Go to Dashboard
            </Button>
          </>
        )}
      </div>
    </div>
  );
}