import { describe, expect, test } from "vitest";
import { checkRateLimit, createRateLimitStore } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  test("allows requests up to the limit", () => {
    const store = createRateLimitStore();
    const opts = { limit: 3, windowMs: 1000 };

    expect(checkRateLimit("key", opts, store).allowed).toBe(true);
    expect(checkRateLimit("key", opts, store).allowed).toBe(true);
    expect(checkRateLimit("key", opts, store).allowed).toBe(true);
  });

  test("blocks requests once the limit is exceeded", () => {
    const store = createRateLimitStore();
    const opts = { limit: 2, windowMs: 1000 };

    checkRateLimit("key", opts, store);
    checkRateLimit("key", opts, store);
    const result = checkRateLimit("key", opts, store);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  test("tracks separate keys independently", () => {
    const store = createRateLimitStore();
    const opts = { limit: 1, windowMs: 1000 };

    expect(checkRateLimit("a", opts, store).allowed).toBe(true);
    expect(checkRateLimit("b", opts, store).allowed).toBe(true);
    expect(checkRateLimit("a", opts, store).allowed).toBe(false);
  });

  test("allows requests again once the window has passed", () => {
    const store = createRateLimitStore();
    const opts = { limit: 1, windowMs: 10 };

    expect(checkRateLimit("key", opts, store).allowed).toBe(true);
    expect(checkRateLimit("key", opts, store).allowed).toBe(false);

    // Manually age the recorded hit past the window instead of sleeping.
    const bucket = store.get("key");
    if (bucket) bucket.hits = bucket.hits.map((t) => t - 20);

    expect(checkRateLimit("key", opts, store).allowed).toBe(true);
  });
});
