import { Router, Request, Response } from 'express';
import { UserService } from '../services/userService';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validate } from '../middleware/validationHandler';
import {
  registerValidators,
  loginValidators,
  userIdParamValidator,
} from '../middleware/validators';

const router = Router();
const userService = new UserService();

router.post('/register', registerValidators, validate, async (req: Request, res: Response) => {
  try {
    const { fullName, dateOfBirth, email, password } = req.body;
    const result = await userService.register({
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      email,
      password,
    });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', loginValidators, validate, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login({ email, password });
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

router.get('/:id', authenticate, userIdParamValidator, validate, async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const currentUserId = req.user!.userId;
    const isAdmin = req.user!.role === 'admin';
    const user = await userService.getUserById(id, currentUserId, isAdmin);
    res.json(user);
  } catch (error: any) {
    if (error.message === 'Access denied') {
      res.status(403).json({ message: error.message });
    } else if (error.message === 'User not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

router.get('/', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/block', authenticate, userIdParamValidator, validate, async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const currentUserId = req.user!.userId;
    const isAdmin = req.user!.role === 'admin';
    const user = await userService.blockUser(id, currentUserId, isAdmin);
    res.json(user);
  } catch (error: any) {
    if (error.message === 'Access denied') {
      res.status(403).json({ message: error.message });
    } else if (error.message === 'User not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

export default router;
