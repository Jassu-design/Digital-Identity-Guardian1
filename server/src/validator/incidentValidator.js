import { body } from 'express-validator'

export const createIncidentValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters.'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required.')
    .isLength({ min: 3, max: 5000 })
    .withMessage('Message must be between 3 and 5000 characters.'),

  body('sender')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Sender cannot exceed 100 characters.'),

  body('category')
    .optional()
    .isIn([
      'otp',
      'banking',
      'phishing',
      'delivery',
      'government',
      'healthcare',
      'social_media',
      'promotional',
      'recycled_number',
      'identity_theft',
      'other',
    ])
    .withMessage('Invalid category.'),

  body('severity')
    .optional()
    .isIn([
      'low',
      'medium',
      'high',
      'critical',
    ])
    .withMessage('Invalid severity.'),

  body('riskScore')
    .optional()
    .isInt({
      min: 0,
      max: 100,
    })
    .withMessage('Risk score must be between 0 and 100.'),

  body('source')
    .optional()
    .isIn([
      'manual',
      'sms',
      'screenshot',
      'email',
      'other',
    ])
    .withMessage('Invalid source.'),
]

export const resolveIncidentValidator = [
  body('status')
    .optional()
    .isIn([
      'resolved',
      'false_positive',
    ])
    .withMessage(
      'Status must be either resolved or false_positive.',
    ),

  body('resolutionNote')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage(
      'Resolution note cannot exceed 1000 characters.',
    ),
]