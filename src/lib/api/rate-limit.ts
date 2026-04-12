/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window counter per IP.
 * Note: On serverless (Vercel), each instance has its own memory,
 * so this provides per-instance limiting. For strict global limits,
 * use Redis/Upstash.
 */

const store = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of store) {
    if (val.resetAt < now) store.delete(key);
  }
}, 60_000);

interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
}

export function rateLimit(
  ip: string,
  { limit = 60, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, limit };
  }

  entry.count++;
  if (entry.count > limit) {
    return { success: false, remaining: 0, limit };
  }

  return { success: true, remaining: limit - entry.count, limit };
}

export function getRateLimitHeaders(result: RateLimitResult) {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
  };
}
