import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipRateMap = new Map<string, RateLimitRecord>();

/**
 * Sliding Window Rate Limiter Utility
 * @param req NextRequest
 * @param limit max requests allowed within window (default 30)
 * @param windowMs window size in milliseconds (default 60,000ms = 1 minute)
 */
export function checkRateLimit(
  req: NextRequest,
  limit: number = 30,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetMs: number } {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const now = Date.now();
  const record = ipRateMap.get(ip);

  if (!record || now > record.resetTime) {
    ipRateMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1, resetMs: windowMs };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetMs: record.resetTime - now,
    };
  }

  record.count += 1;
  ipRateMap.set(ip, record);

  return {
    allowed: true,
    remaining: limit - record.count,
    resetMs: record.resetTime - now,
  };
}
