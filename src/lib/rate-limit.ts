/**
 * In-memory sliding-window rate limiter. Single-instance only — state is a
 * module-level Map, so it resets on redeploy and does not share state across
 * multiple server instances. Good enough for this app's scale; swap for a
 * Redis/Supabase-backed limiter if the app ever runs multi-instance.
 */

type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
};

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
  store: Map<string, Bucket> = buckets,
): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    store.set(key, bucket);
    const retryAfterMs = windowMs - (now - bucket.hits[0]);
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  bucket.hits.push(now);
  store.set(key, bucket);
  return {
    allowed: true,
    remaining: limit - bucket.hits.length,
    retryAfterMs: 0,
  };
}

/** Exposed for tests that need an isolated store instead of the shared one. */
export function createRateLimitStore(): Map<string, Bucket> {
  return new Map();
}
