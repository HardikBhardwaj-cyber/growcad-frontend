// app/api/dashboard/stats/route.ts

import { NextRequest } from "next/server";
import { withTenant } from "@/server/middleware/auth";
import { ok, serverError } from "@/server/lib/response";
import db from "@/server/lib/db";

// ✅ EXPLICIT TYPE WRAPPER (IMPORTANT)
export const GET = withTenant(async (req: NextRequest, ctx) => {
  const tenantId = ctx.tenantId!;

  try {
    const now = new Date();

    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalStudents,
      lastMonthStudents,
      newAdmissions,
      lastMonthAdmissions,
      feesThisMonth,
      feesLastMonth,
      pendingDues,
    ] = await Promise.all([
      db.student.count({
        where: {
          tenantId,
          status: "active",
          deletedAt: null,
        },
      }),

      db.student.count({
        where: {
          tenantId,
          status: "active",
          deletedAt: null,
          createdAt: { lt: thisMonthStart },
        },
      }),

      db.student.count({
        where: {
          tenantId,
          createdAt: { gte: thisMonthStart },
          deletedAt: null,
        },
      }),

      db.student.count({
        where: {
          tenantId,
          createdAt: { gte: lastMonthStart, lt: thisMonthStart },
          deletedAt: null,
        },
      }),

      db.fee.aggregate({
        where: {
          tenantId,
          paidAt: { gte: thisMonthStart },
          status: { in: ["paid", "partial"] },
        },
        _sum: { paid: true },
      }),

      db.fee.aggregate({
        where: {
          tenantId,
          paidAt: { gte: lastMonthStart, lt: thisMonthStart },
          status: { in: ["paid", "partial"] },
        },
        _sum: { paid: true },
      }),

      db.fee.aggregate({
        where: {
          tenantId,
          status: { in: ["partial", "overdue"] },
        },
        _sum: { amount: true },
      }),
    ]);

    const feesCollected = feesThisMonth._sum.paid ?? 0;
    const feesLast = feesLastMonth._sum.paid ?? 0;
    const pendingTotal = pendingDues._sum.amount ?? 0;

    const pct = (a: number, b: number) =>
      b === 0 ? 0 : Math.round(((a - b) / b) * 100);

    return ok({
      totalStudents,
      studentDelta: pct(totalStudents, lastMonthStudents),

      feesCollected,
      feesDelta: pct(feesCollected, feesLast),

      newAdmissions,
      admissionDelta: pct(newAdmissions, lastMonthAdmissions),

      pendingDues: pendingTotal,
      pendingDelta: 0,
    });
  } catch (err) {
    return serverError(err);
  }
});