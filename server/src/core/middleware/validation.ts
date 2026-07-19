import { Request, Response, NextFunction } from "express";

/**
 * XSS basic sanitization — removes script tags and event handlers from strings.
 * For production, use a library like `sanitize-html` or `dompurify`.
 */
function sanitizeString(value: unknown): unknown {
  if (typeof value !== "string") return value;
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

function sanitizeDeep(obj: unknown): unknown {
  if (typeof obj === "string") return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeDeep);
  if (obj && typeof obj === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      sanitized[k] = sanitizeDeep(v);
    }
    return sanitized;
  }
  return obj;
}

/**
 * Middleware that recursively sanitizes all string values in req.body
 * to prevent XSS stored in the database.
 */
export function sanitizeBody(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeDeep(req.body);
  }
  next();
}

/**
 * Validate that required fields are present in req.body.
 * Returns 400 with a structured error message if any are missing.
 */
export function requireFields(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = fields.filter(
      (f) => req.body[f] === undefined || req.body[f] === null || req.body[f] === ""
    );
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
        missing,
      });
    }
    next();
  };
}

/**
 * Rate-limiting guard for content generation — prevents runaway requests.
 * Simple in-memory implementation; use Redis for production.
 */
const genRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const GEN_LIMIT = 10; // max 10 generations per minute per user
const GEN_WINDOW_MS = 60_000;

export function generationRateLimit(req: Request, res: Response, next: NextFunction) {
  const userId = (req as any).user?.id;
  if (!userId) return next(); // let authGuard handle unauthenticated

  const now = Date.now();
  const entry = genRateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    genRateLimitMap.set(userId, { count: 1, resetAt: now + GEN_WINDOW_MS });
    return next();
  }

  if (entry.count >= GEN_LIMIT) {
    return res.status(429).json({
      success: false,
      message: `Rate limit exceeded: max ${GEN_LIMIT} generations per minute. Please wait.`,
    });
  }

  entry.count++;
  next();
}
