// server/lib/response.ts
// ─────────────────────────────────────────────────────────────────────────────
// Centralised API response system for Next.js App Router.
//
// Every route module imports helpers from here and never calls
// NextResponse.json() directly. This guarantees:
//   • Every response follows the same envelope shape
//   • HTTP status codes are never misspelled inline
//   • Error detail visibility is environment-aware (dev vs production)
//   • The client ApiResponse<T> type in types/index.ts always matches
//
// Envelope (strict — all four keys always present):
// {
//   "success": boolean,
//   "message": string,
//   "data":    T | null,
//   "errors":  FieldError[] | null
// }
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';

// ─── Internal types ───────────────────────────────────────────────────────────

/** Per-field validation error forwarded to the client. */
export interface FieldError {
  field:   string;
  message: string;
}

/** The exact envelope shape every response carries. */
interface Envelope<T> {
  success: boolean;
  message: string;
  data:    T | null;
  errors:  FieldError[] | null;
}

// ─── Envelope builder ─────────────────────────────────────────────────────────
// One private factory; all exported helpers delegate to it.

function envelope<T>(
  success: boolean,
  status:  number,
  message: string,
  data:    T | null     = null,
  errors:  FieldError[] | null = null,
): NextResponse<Envelope<T>> {
  const body: Envelope<T> = { success, message, data, errors };
  return NextResponse.json(body, { status });
}

// ─── 2xx Success ─────────────────────────────────────────────────────────────

/**
 * 200 OK — standard success response.
 * @example return ok(student);
 * @example return ok(student, 'Student enrolled');
 */
export function ok<T>(data: T, message = 'OK'): NextResponse<Envelope<T>> {
  return envelope(true, 200, message, data);
}

/**
 * 201 Created — resource was created successfully.
 * @example return created(newStudent, 'Student enrolled');
 */
export function created<T>(data: T, message = 'Created'): NextResponse<Envelope<T>> {
  return envelope(true, 201, message, data);
}

/**
 * 204 No Content — success with no response body.
 * Returns a raw NextResponse so callers can return it directly.
 */
export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

// ─── 4xx Client errors ────────────────────────────────────────────────────────

/**
 * 400 Bad Request — malformed input or failed validation.
 *
 * @param message  Human-readable summary (shown to the user).
 * @param errors   Optional per-field validation errors for form highlighting.
 *
 * @example return badRequest('Enter a valid email');
 * @example return badRequest('Validation failed', [{ field: 'email', message: 'Required' }]);
 */
export function badRequest(
  message: string,
  errors?: FieldError[] | string[],
): NextResponse<Envelope<null>> {
  // Accept either FieldError[] or plain string[] (from Zod .map())
  const normalised: FieldError[] | null = errors
    ? (errors as unknown[]).map((e) =>
        typeof e === 'string'
          ? { field: 'unknown', message: e }
          : (e as FieldError),
      )
    : null;

  return envelope<null>(false, 400, message, null, normalised);
}

/**
 * 401 Unauthorized — missing or invalid authentication credentials.
 * @example return unauthorized();
 * @example return unauthorized('Session expired. Please sign in again.');
 */
export function unauthorized(
  message = 'Unauthorized. Please sign in to continue.',
): NextResponse<Envelope<null>> {
  return envelope<null>(false, 401, message);
}

/**
 * 403 Forbidden — authenticated but not permitted.
 * @example return forbidden('Admin access required.');
 */
export function forbidden(
  message = 'You do not have permission to perform this action.',
): NextResponse<Envelope<null>> {
  return envelope<null>(false, 403, message);
}

/**
 * 404 Not Found — requested resource does not exist.
 * @example return notFound('Student');        // → "Student not found"
 * @example return notFound('Subscription');
 */
export function notFound(resource = 'Resource'): NextResponse<Envelope<null>> {
  return envelope<null>(false, 404, `${resource} not found.`);
}

/**
 * 409 Conflict — state conflict (duplicate key, wrong status transition, etc.)
 * @example return conflict('An account with this email already exists.');
 */
export function conflict(message: string): NextResponse<Envelope<null>> {
  return envelope<null>(false, 409, message);
}

/**
 * 429 Too Many Requests — rate limit exceeded.
 * @example return tooManyRequests('Too many OTP requests. Please wait 60 seconds.');
 */
export function tooManyRequests(message: string): NextResponse<Envelope<null>> {
  return envelope<null>(false, 429, message);
}

// ─── 5xx Server errors ────────────────────────────────────────────────────────

/**
 * 500 Internal Server Error.
 *
 * Security contract:
 *   • Development: logs the full error + stack to console.
 *   • Production:  logs the error server-side but returns a generic message
 *     to the client — internal error details are never exposed.
 *
 * @example
 *   try { ... } catch (err) { return serverError(err); }
 */
export function serverError(err: unknown): NextResponse<Envelope<null>> {
  // Always log on the server side regardless of environment.
  const message =
    err instanceof Error
      ? `${err.message}\n${err.stack ?? ''}`
      : String(err);

  console.error('[API Error]', message);

  // Expose detail only in development.
  const clientMessage =
    process.env.NODE_ENV === 'development' && err instanceof Error
      ? err.message
      : 'Something went wrong. Please try again later.';

  return envelope<null>(false, 500, clientMessage);
}
