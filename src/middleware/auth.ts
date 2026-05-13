import { Request, Response, NextFunction } from 'express';
import passportMiddleware from '../utils/jwt';

export interface CustomUser {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface User extends CustomUser {}
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  passportMiddleware.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err || !user) {
      return res.status(401).json({ message: err?.message || 'Access denied. Invalid token.' });
    }
    req.user = user as CustomUser & Express.User;
    next();
  })(req, res, next);
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    return;
  }
  next();
};
