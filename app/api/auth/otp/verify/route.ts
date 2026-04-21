// app/api/auth/otp/verify/route.ts
// PUT /api/auth/otp/verify — explicit alias for OTP verification.
// The primary route is PUT /api/auth/otp — this alias supports both paths.

import { NextRequest } from "next/server";
import { z } from "zod";
import { parseBody } from "@/server/middleware/validate";
import { ok, unauthorized, serverError } from "@/server/lib/response";
import { verifyOtp, verifyPhoneAndActivate } from "@/server/modules/auth/service";
import db from "@/server/lib/db";

const schema = z.object({
  phone: z.string().regex(/^\d{10}$/),
  otp:   z.string().length(6),
});

export async function PUT(req: NextRequest) {
  const { data, error } = await parseBody(req, schema);
  if (error) return error;

  try {
    const valid = await verifyOtp(data.phone, data.otp);
    if (!valid) return unauthorized("Incorrect or expired code. Please try again.");

    const user = await db.user.findUnique({ where: { phone: data.phone } });
    if (!user) return unauthorized("Account not found for this phone number.");

    const { token } = await verifyPhoneAndActivate(user.id);

    const profile = await db.user.findUnique({
      where:  { id: user.id },
      select: { id: true, name: true, email: true, phone: true, role: true, tenantId: true, avatar: true, createdAt: true },
    });

    return ok({ user: profile, token }, "Phone verified successfully");
  } catch (err) {
    return serverError(err);
  }
}
