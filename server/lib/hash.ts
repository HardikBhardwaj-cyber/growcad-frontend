// server/lib/hash.ts
// ─────────────────────────────────────────────────────────────────────────────
// Password hashing utilities using bcrypt.
//
// Why bcrypt:
//   bcrypt applies a cost factor that makes brute-force attacks progressively
//   slower as hardware improves (by raising SALT_ROUNDS). Unlike SHA-based
//   algorithms, bcrypt is purposely slow and cannot be accelerated on GPUs.
//
// Salt rounds:
//   Defaults to 12. Each additional round doubles the computation time.
//   12 rounds ≈ 250ms on modern hardware — acceptable for an auth endpoint,
//   expensive enough to deter offline attacks on a leaked database.
//   Override via BCRYPT_SALT_ROUNDS env var for environment-specific tuning
//   (e.g., lower in test environments where speed matters more than security).
// ─────────────────────────────────────────────────────────────────────────────

import bcrypt from 'bcrypt';

// ─── Configuration ────────────────────────────────────────────────────────────

const DEFAULT_SALT_ROUNDS = 12;

const SALT_ROUNDS: number = (() => {
  const env = process.env.BCRYPT_SALT_ROUNDS;
  if (!env) return DEFAULT_SALT_ROUNDS;
  const parsed = parseInt(env, 10);
  // Clamp to a sane range: below 10 is insecure, above 20 is impractically slow.
  if (Number.isNaN(parsed) || parsed < 10 || parsed > 20) return DEFAULT_SALT_ROUNDS;
  return parsed;
})();

// ─── hashPassword ─────────────────────────────────────────────────────────────

/**
 * Hash a plaintext password using bcrypt.
 *
 * @param   password  The plaintext password to hash. Must be a non-empty string.
 * @returns           A bcrypt hash string suitable for database storage.
 * @throws  {Error}   If `password` is empty or contains only whitespace.
 *
 * @example
 *   const hash = await hashPassword('hunter2');
 *   await db.user.update({ where: { id }, data: { passwordHash: hash } });
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || password.trim().length === 0) {
    throw new Error('Password must not be empty.');
  }
  return bcrypt.hash(password, SALT_ROUNDS);
}

// ─── comparePassword ──────────────────────────────────────────────────────────

/**
 * Compare a plaintext password against a bcrypt hash.
 *
 * Returns `false` on any mismatch — including when `hash` is not a valid
 * bcrypt string — without throwing. This keeps the login path uniform: a bad
 * hash format is treated identically to a wrong password from the caller's
 * perspective, preventing timing-based leakage of hash validity.
 *
 * @param   password  The plaintext password to verify.
 * @param   hash      The bcrypt hash retrieved from the database.
 * @returns           `true` if the password matches the hash, `false` otherwise.
 *
 * @example
 *   const valid = await comparePassword(input.password, user.passwordHash);
 *   if (!valid) return unauthorized('Invalid credentials.');
 */
export async function comparePassword(
  password: string,
  hash:     string,
): Promise<boolean> {
  if (!password || !hash) return false;
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    // bcrypt.compare throws if `hash` is not a valid bcrypt string.
    // Treat malformed hashes as a non-match rather than a 500 error.
    return false;
  }
}
