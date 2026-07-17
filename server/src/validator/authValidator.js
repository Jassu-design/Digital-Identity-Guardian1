import {body} from 'express-validator'

export const registerValidator = [
  body('name')
    .trim()
    .isLength({min: 2, max: 50})
    .withMessage('Name must contain 2 to 50 characters.'),

  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Enter a valid email address.'),

  body('password')
    .isLength({min: 8})
    .withMessage('Password must contain at least 8 characters.'),
]

export const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Enter a valid email address.'),

  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
]