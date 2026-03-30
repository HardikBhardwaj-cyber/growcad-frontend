"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getTenants,
  updateTenant,
  Tenant,
} from "@/modules/tenant/api";
import Button from "@/components/ui/Button";

export default function TenantsPage() {
  const [search, setSearch] = useState("");

  // ✅ QUERY (TYPE SAFE)
  const { data, refetch, isLoading, error } = useQuery<Tenant[]>({
    queryKey: ["tenants"],
    queryFn: getTenants,
  });

  // ✅ MUTATION
  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Tenant>;
    }) => updateTenant(id, data),

    onSuccess: () => refetch(),
  });

  if (isLoading)
    return <p className="p-6 text-gray-400">Loading...</p>;

  if (error)
    return (
      <p className="p-6 text-red-400">
        Error loading tenants
      </p>
    );

  // ✅ CLEAN DATA (NO .data)
  const tenants =
    data?.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-4">
        Tenants Control
      </h2>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search tenant..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-3 mb-6 border border-white/10 rounded-xl bg-white/5 w-full"
      />

      <div className="space-y-6">
        {tenants.map((t) => (
          <div
            key={t.id}
            className="glass p-6 rounded-2xl"
          >
            {/* 🔥 HEADER */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">
                  {t.name}
                </p>

                <p className="text-sm text-gray-400">
                  {t.subdomain}.growcad.in
                </p>

                <p className="text-sm">
                  Revenue: ₹{t.revenue}
                </p>
              </div>

              <Button
                loading={mutation.isPending}
                onClick={() =>
                  mutation.mutate({
                    id: t.id,
                    data: { is_active: !t.is_active },
                  })
                }
              >
                {t.is_active ? "Disable" : "Enable"}
              </Button>
            </div>

            {/* 💰 BILLING */}
            <div className="mt-4 text-sm space-y-1">
              <p className="text-gray-400">
                Peak Students: {t.peak_students}
              </p>

              <p className="text-gray-400">
                Extra Students: {t.extra_students}
              </p>

              <p className="text-red-400">
                Pending: ₹{t.pending_amount}
              </p>
            </div>

            {/* 📊 USAGE */}
            <div className="mt-4 text-sm space-y-1">
              <p>
                SMS: {t.sms_used} / {t.sms_limit}
              </p>

              <p>
                WA: {t.wa_used} / {t.wa_limit}
              </p>

              <p>
                Storage: {t.storage_used} MB
              </p>
            </div>

            {/* ⚙️ PLAN */}
            <div className="mt-4">
              <label className="text-sm text-gray-400">
                Plan
              </label>

              <select
                defaultValue={t.plan}
                onChange={(e) =>
                  mutation.mutate({
                    id: t.id,
                    data: {
                      plan: e.target.value as Tenant["plan"],
                    },
                  })
                }
                className="p-2 mt-1 border border-white/10 rounded-xl bg-white/5"
              >
                <option value="basic">Basic</option>
                <option value="academic">Academic</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* 🔥 FEATURES */}
            <div className="mt-4 flex gap-3 flex-wrap">
              <Button
                loading={mutation.isPending}
                onClick={() =>
                  mutation.mutate({
                    id: t.id,
                    data: { ai_enabled: !t.ai_enabled },
                  })
                }
              >
                AI: {t.ai_enabled ? "ON" : "OFF"}
              </Button>

              <Button
                loading={mutation.isPending}
                onClick={() =>
                  mutation.mutate({
                    id: t.id,
                    data: {
                      whatsapp_enabled:
                        !t.whatsapp_enabled,
                    },
                  })
                }
              >
                WhatsApp:{" "}
                {t.whatsapp_enabled ? "ON" : "OFF"}
              </Button>
            </div>

            {/* 📏 LIMITS */}
            <div className="mt-4 flex gap-3 flex-wrap">
              <input
                type="number"
                defaultValue={t.sms_limit}
                className="p-2 border border-white/10 rounded-xl bg-white/5"
                onBlur={(e) =>
                  mutation.mutate({
                    id: t.id,
                    data: {
                      sms_limit: Number(e.target.value),
                    },
                  })
                }
              />

              <input
                type="number"
                defaultValue={t.wa_limit}
                className="p-2 border border-white/10 rounded-xl bg-white/5"
                onBlur={(e) =>
                  mutation.mutate({
                    id: t.id,
                    data: {
                      wa_limit: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}