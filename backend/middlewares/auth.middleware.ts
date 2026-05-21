import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export interface AuthRequest extends Request {
  user?: any;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ error: 'No token provided', code: 'UNAUTHORIZED' });
    }

    const token = header.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Invalid token format', code: 'UNAUTHORIZED' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token', code: 'UNAUTHORIZED' });
  }
}
