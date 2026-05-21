import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient permissions', code: 'FORBIDDEN' });
      }

      next();
    } catch (err) {
      return res.status(500).json({ error: 'Role check failed', code: 'ROLE_ERROR' });
    }
  };
}
