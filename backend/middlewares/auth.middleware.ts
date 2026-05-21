import { Request, Response, NextFunction } from 'express';

// =====================
// AUTHENTICATION MIDDLEWARE
// =====================
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Missing Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    // TODO: verify JWT token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Mock decoded payload for scaffold
    req.user = {
      id: 'mock-user-id',
      role: 'cashier'
    };

    next();
  } catch (err: any) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// =====================
// ROLE-BASED ACCESS CONTROL
// =====================
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
