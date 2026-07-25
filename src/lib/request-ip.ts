import "server-only";
import { headers } from "next/headers";

/**
 * Best-effort client identifier for rate limiting. Trusts `x-forwarded-for`
 * because this app is designed to run behind a proxy/load balancer; on a
 * bare Node deployment with no proxy this falls back to a constant, which
 * makes the limiter effectively global rather than per-client.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
