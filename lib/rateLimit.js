// Tiny in-memory rate limiter. For multi-instance deployments, swap for Redis
// or Upstash. This is fine for single-region Vercel deployments and protects
// against casual abuse.

const buckets = new Map();
const SWEEP_MS = 60_000;

setInterval(() => {
  const now = Date.now();
  for (const [k, b] of buckets) {
    if (b.resetAt < now) buckets.delete(k);
  }
}, SWEEP_MS).unref?.();

/**
 * @param {string} key       Bucket identifier (e.g. "leads:<ip>").
 * @param {number} max       Max requests allowed.
 * @param {number} windowMs  Time window in milliseconds.
 * @returns {{ok: boolean, remaining: number, resetAt: number}}
 */
export function rateLimit(key, max = 5, windowMs = 60_000) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, resetAt: now + windowMs };
  }
  if (b.count >= max) {
    return { ok: false, remaining: 0, resetAt: b.resetAt };
  }
  b.count++;
  return { ok: true, remaining: max - b.count, resetAt: b.resetAt };
}

export function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string") return xff.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}
