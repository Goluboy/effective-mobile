import { body, param, query } from 'express-validator';

export const registerValidators = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidators = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const userIdParamValidator = [
  param('id').isMongoId().withMessage('Invalid user ID'),
];

export const updateUserStatusValidators = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
];
