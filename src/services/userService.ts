import { User } from '../models/User';
import { generateToken } from '../utils/tokenGenerator';
import { UserRole, UserStatus } from '../types/user';

interface RegisterInput {
  fullName: string;
  dateOfBirth: Date;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export class UserService {
  async register(userData: RegisterInput) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = new User({
      fullName: userData.fullName,
      dateOfBirth: userData.dateOfBirth,
      email: userData.email,
      password: userData.password,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });

    await user.save();

    const token = generateToken({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      token,
    };
  }

  async login(loginData: LoginInput) {
    const user = await User.findOne({ email: loginData.email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new Error('Account is blocked');
    }

    const isPasswordValid = await user.comparePassword(loginData.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      token,
    };
  }

  async getUserById(userId: string, currentUserId: string, isAdmin: boolean) {
    if (userId !== currentUserId && !isAdmin) {
      throw new Error('Access denied');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getAllUsers() {
    const users = await User.find().select('-password');
    return users.map((user) => ({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async blockUser(userId: string, currentUserId: string, isAdmin: boolean) {
    if (userId !== currentUserId && !isAdmin) {
      throw new Error('Access denied');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.status = UserStatus.INACTIVE;
    await user.save();

    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }
}
