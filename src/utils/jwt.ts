import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { config } from '../config';
import { User } from '../models/User';
import { UserRole } from '../types/user';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

passport.use(
  new JwtStrategy(options, async (payload: JwtPayload, done: VerifiedCallback) => {
    try {
      const user = await User.findById(payload.userId);
      if (!user) {
        return done(null, false);
      }
      return done(null, {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
