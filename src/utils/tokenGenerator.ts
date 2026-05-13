import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { UserRole } from '../types/user';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export const generateToken = (user: { _id?: string; email: string; role: UserRole }): string => {
  const payload: JwtPayload = {
    userId: user._id!,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as SignOptions);
};
