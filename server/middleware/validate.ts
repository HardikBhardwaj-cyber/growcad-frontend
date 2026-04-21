// server/middleware/validate.ts
// ─────────────────────────────────────────────────────────────────────────────
// Reusable request body validator for Next.js App Router API routes.
//
// Usage in a route handler:
//
//   const schema = z.object({ email: z.string().email(), name: z.string().min(2) });
//
//   export const POST = withTenant(async (req, ctx) => {
//     const { data, error } = await parseBody(req, schema);
//     if (error) return error;          // ← already a NextResponse, just return it
//     // data is fully typed: { email: string; name: string }
//     ...
//   });
//
// Design decisions:
//   • Returns a discriminated union so callers use `if (error) return error`
//     — one line, no try/catch at the call site.
//   • All field-level Zod errors are forwarded so the client can highlight
//     individual form fields without a second round-trip.
//   • The function never throws — every failure path is encoded in the return
//     type, keeping route handlers clean and predictable.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextRequest, NextResponse } from 'next/server';
import type { ZodSchema, ZodError, ZodIssue } from 'zod';
import { badRequest, type FieldError } from '@/server/lib/response';
// ─── Return type ──────────────────────────────────────────────────────────────
// A strict discriminated union:
//   • { data: T;    error: null }     — parse succeeded
//   • { data: null; error: Response } — parse failed, response ready to return

type ParseSuccess<T> = { data: T;    error: null };
type ParseFailure    = { data: null; error: NextResponse<unknown> };
type ParseResult<T>  = ParseSuccess<T> | ParseFailure;

// ─── Zod issue → FieldError ───────────────────────────────────────────────────
// Converts Zod's internal issue format into the clean FieldError shape the
// client expects. Nested paths are joined with dots: "address.city".

function issueToFieldError(issue: ZodIssue): FieldError {
  return {
    field:   issue.path.length > 0 ? issue.path.join('.') : '_root',
    message: issue.message,
  };
}

// ─── parseBody ────────────────────────────────────────────────────────────────

/**
 * Parse and validate a Next.js `NextRequest` JSON body against a Zod schema.
 *
 * @param req    The incoming `NextRequest` from a route handler.
 * @param schema Any Zod schema — object, union, discriminatedUnion, etc.
 * @returns      A discriminated union:
 *               `{ data: T, error: null }` on success,
 *               `{ data: null, error: NextResponse }` on failure.
 *
 * @example
 *   const { data, error } = await parseBody(req, z.object({ name: z.string() }));
 *   if (error) return error;
 *   // data.name is string
 */
export async function parseBody<T>(
  req:    NextRequest,
  schema: ZodSchema<T>,
): Promise<ParseResult<T>> {
  // ── Step 1: Parse the raw JSON body ─────────────────────────────────────────
  // req.json() throws a SyntaxError on malformed JSON. We catch it and return
  // a 400 with a human-readable message rather than letting it propagate as a
  // 500.
  let raw: unknown;

  try {
    raw = await req.json();
  } catch (cause) {
    const detail =
      cause instanceof SyntaxError
        ? `JSON parse error: ${cause.message}`
        : 'Request body could not be read.';

    return {
      data:  null,
      error: badRequest('Invalid JSON body.', [{ field: '_root', message: detail }]),
    };
  }

  // ── Step 2: Validate against the schema ─────────────────────────────────────
  const result = schema.safeParse(raw);

  if (!result.success) {
    const errors: FieldError[] = result.error.issues.map(issueToFieldError);

    // Use the first issue as the top-level human message (most relevant).
    const topMessage = errors[0]?.message ?? 'Validation failed.';

    return {
      data:  null,
      error: badRequest(topMessage, errors),
    };
  }

  // ── Step 3: Return parsed and typed data ─────────────────────────────────────
  return { data: result.data, error: null };
}

// ─── parseQuery ───────────────────────────────────────────────────────────────
// Companion helper for validating URL search params.
// Coerces all values from string to the schema's expected types.
//
// @example
//   const schema = z.object({ page: z.coerce.number().int().positive().default(1) });
//   const { data, error } = parseQuery(req, schema);
//   if (error) return error;
//   // data.page is number

export function parseQuery<T>(
  req:    NextRequest,
  schema: ZodSchema<T>,
): ParseResult<T> {
  const url    = new URL(req.url);
  const raw: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    raw[key] = value;
  });

  const result = schema.safeParse(raw);

  if (!result.success) {
    const errors: FieldError[] = result.error.issues.map(issueToFieldError);
    const topMessage = errors[0]?.message ?? 'Invalid query parameters.';
    return { data: null, error: badRequest(topMessage, errors) };
  }

  return { data: result.data, error: null };
}
