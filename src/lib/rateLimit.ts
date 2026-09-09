/**
 * Best-effort per-key rate limit. In-memory, so it resets on cold start and
 * doesn't share state across serverless instances — good enough as a first
 * line of defense against casual abuse of unauthenticated endpoints, not a
 * substitute for a shared store (e.g. Upstash Redis) under real attack
 * traffic.
 */
const requestLog = new Map<string, number[]>();

export function isRateLimited(key: string, windowMs: number, max: number): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  requestLog.set(key, timestamps);
  return timestamps.length > max;
}

export function clientIp(req: { headers: Headers }): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
