import {body} from 'express-validator'

const allowedSources = [
  'sms',
  'email',
  'whatsapp',
  'social_media',
  'manual',
  'other',
]

export const aiAnalysisValidator = [
  body('message')
    .exists({checkFalsy: true})
    .withMessage('Message is required.')
    .bail()
    .isString()
    .withMessage('Message must be a string.')
    .bail()
    .trim()
    .isLength({min: 3, max: 5000})
    .withMessage(
      'Message must contain between 3 and 5000 characters.',
    ),

  body('sender')
    .optional()
    .isString()
    .withMessage('Sender must be a string.')
    .bail()
    .trim()
    .isLength({max: 150})
    .withMessage(
      'Sender cannot contain more than 150 characters.',
    ),

  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string.')
    .bail()
    .trim()
    .isLength({min: 3, max: 200})
    .withMessage(
      'Title must contain between 3 and 200 characters.',
    ),

  body('mobileNumberId')
    .optional({checkFalsy: true})
    .isMongoId()
    .withMessage('Mobile number ID must be a valid MongoDB ID.'),

  body('saveAsIncident')
    .optional()
    .isBoolean()
    .withMessage('saveAsIncident must be true or false.')
    .toBoolean(),

  body('source')
    .optional()
    .isString()
    .withMessage('Source must be a string.')
    .bail()
    .isIn(allowedSources)
    .withMessage(
      `Source must be one of: ${allowedSources.join(', ')}.`,
    ),
]