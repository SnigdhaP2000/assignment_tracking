import { Request, Response, NextFunction } from "express";
import { errosMessages } from "../util/errorMessages";
import { verifyToken } from "../util/jwt";

// Extend Request type to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        permissions: string[];
      };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (token) {
    const decoded = verifyToken(token);
    if (typeof decoded === "object" && decoded !== null) {
      const { user_id, permissions } = decoded as {
        user_id: string;
        permissions: string[];
      };
      req.user = { user_id, permissions };
      next();
    } else {
      res.status(401).json({ error: errosMessages.unauthorized });
    }
  } else {
    res.status(401).json({ error: errosMessages.unauthorized });
  }
};
