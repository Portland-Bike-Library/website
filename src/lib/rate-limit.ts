// Simple in-memory rate limiter
// In production with multiple instances, use Redis instead

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    // Create new window
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remaining: limit - 1, resetIn: windowMs };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetIn: entry.resetAt - now,
    };
  }

  entry.count++;
  return {
    success: true,
    remaining: limit - entry.count,
    resetIn: entry.resetAt - now,
  };
}

export function getClientIp(request: Request): string {
  // Check common headers for real IP (behind proxies like Cloudflare/Vercel)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Cloudflare specific
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp;
  }

  return "unknown";
}
