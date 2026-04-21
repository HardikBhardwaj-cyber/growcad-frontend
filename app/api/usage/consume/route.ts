// app/api/usage/consume/route.ts
// POST /api/usage/consume — check limit and increment if allowed.
// Used internally by communication, AI, and storage action routes.
// Returns { allowed, used, limit, reason } — callers block if !allowed.

import { z } from "zod";
import { withTenant } from "@/server/middleware/auth";
import { parseBody } from "@/server/middleware/validate";
import { ok, serverError } from "@/server/lib/response";
import { consumeUsage } from "@/server/modules/usage/service";
import db from "@/server/lib/db";
import type { PlanId, BillingCycle, UsageMetricKey } from "@/modules/billing/types";

const schema = z.object({
  metric:   z.string(),
  quantity: z.number().int().positive().default(1),
});

export const POST = withTenant(async (req, ctx) => {
  const { data, error } = await parseBody(req, schema);
  if (error) return error;

  try {
    const sub = await db.subscription.findFirst({
      where:   { tenantId: ctx.tenantId!, status: "active" },
      orderBy: { createdAt: "desc" },
      select:  { planId: true, cycle: true },
    });

    const result = await consumeUsage(
      {
        tenantId: ctx.tenantId!,
        planId:   (sub?.planId ?? "basic") as PlanId,
        cycle:    (sub?.cycle  ?? "monthly") as BillingCycle,
      },
      data.metric as UsageMetricKey,
      data.quantity,
    );

    return ok(result);
  } catch (err) {
    return serverError(err);
  }
});
