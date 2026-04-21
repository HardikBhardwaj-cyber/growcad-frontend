// app/api/dashboard/stats/route.ts
// GET /api/dashboard/stats

import { withTenant } from "@/server/middleware/auth";
import { ok, serverError } from "@/server/lib/response";
import db from "@/server/lib/db";

export const GET = withTenant(async (req, ctx) => {
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
      // ✅ Total active students
      db.student.count({
        where: {
          tenantId,
          status: "active",
          deletedAt: null,
        },
      }),

      // ✅ Students till last month
      db.student.count({
        where: {
          tenantId,
          status: "active",
          deletedAt: null,
          createdAt: { lt: thisMonthStart },
        },
      }),

      // ✅ New admissions this month
      db.student.count({
        where: {
          tenantId,
          createdAt: { gte: thisMonthStart },
          deletedAt: null,
        },
      }),

      // ✅ New admissions last month
      db.student.count({
        where: {
          tenantId,
          createdAt: { gte: lastMonthStart, lt: thisMonthStart },
          deletedAt: null,
        },
      }),

      // ✅ Fees collected this month
      db.fee.aggregate({
        where: {
          tenantId,
          paidAt: { gte: thisMonthStart },
          status: { in: ["paid", "partial"] },
        },
        _sum: {
          paid: true, // ✔ MUST exist in schema
        },
      }),

      // ✅ Fees collected last month
      db.fee.aggregate({
        where: {
          tenantId,
          paidAt: { gte: lastMonthStart, lt: thisMonthStart },
          status: { in: ["paid", "partial"] },
        },
        _sum: {
          paid: true,
        },
      }),

      // ✅ Pending dues (FIXED)
      db.fee.aggregate({
        where: {
          tenantId,
          status: { in: ["partial", "overdue"] },
        },
        _sum: {
          amount: true, // 🔥 CHANGE THIS → must match your schema field
        },
      }),
    ]);

    // ✅ SAFE EXTRACTION
    const feesCollected = feesThisMonth._sum.paid ?? 0;
    const feesLast = feesLastMonth._sum.paid ?? 0;
    const pendingTotal = pendingDues._sum.amount ?? 0;

    // ✅ Growth %
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