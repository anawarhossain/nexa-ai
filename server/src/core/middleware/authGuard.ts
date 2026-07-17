import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth/auth";

export interface AuthenticatedRequest extends Request {
  user?: Record<string, any>;
  session?: Record<string, any>;
}

/**
 * এই middleware যেকোনো protected route এ ব্যবহার করুন, যেমন:
 * router.post("/items", authGuard, itemsController.create)
 *
 * ভবিষ্যতে /items/add, /items/manage এর মতো protected route গুলোতে
 * এটাই ব্যবহার হবে (Phase 4)।
 */
export async function authGuard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in to continue.",
      });
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid or expired session.",
    });
  }
}
