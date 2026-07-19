import {body} from 'express-validator'

const allowedRoles = [
  'admin',
  'analyst',
  'member',
]

const optionalEmailValidator = body('email')
  .optional({checkFalsy: true})
  .trim()
  .isEmail()
  .withMessage(
    'Please enter a valid organization email.',
  )
  .normalizeEmail()

const optionalPhoneValidator = body('phone')
  .optional({checkFalsy: true})
  .trim()
  .isLength({
    min: 7,
    max: 20,
  })
  .withMessage(
    'Phone number must be between 7 and 20 characters.',
  )

const optionalWebsiteValidator = body('website')
  .optional({checkFalsy: true})
  .trim()
  .isURL({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  .withMessage(
    'Website must be a valid URL starting with http:// or https://.',
  )

const optionalAddressValidator = body('address')
  .optional({checkFalsy: true})
  .trim()
  .isLength({
    max: 500,
  })
  .withMessage(
    'Address cannot exceed 500 characters.',
  )

export const createOrganizationValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage(
      'Organization name is required.',
    )
    .isLength({
      min: 2,
      max: 150,
    })
    .withMessage(
      'Organization name must be between 2 and 150 characters.',
    ),

  body('description')
    .optional()
    .trim()
    .isLength({
      max: 500,
    })
    .withMessage(
      'Description cannot exceed 500 characters.',
    ),

  body('industry')
    .optional()
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      'Industry cannot exceed 100 characters.',
    ),

  optionalEmailValidator,
  optionalPhoneValidator,
  optionalWebsiteValidator,
  optionalAddressValidator,
]

export const joinOrganizationValidator = [
  body('inviteCode')
    .trim()
    .notEmpty()
    .withMessage('Invite code is required.')
    .isLength({
      min: 8,
      max: 20,
    })
    .withMessage('Invalid invite code.'),
]

export const addMemberValidator = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required.')
    .isMongoId()
    .withMessage('Invalid user ID.'),

  body('role')
    .optional()
    .isIn(allowedRoles)
    .withMessage(
      `Role must be one of: ${allowedRoles.join(', ')}.`,
    ),
]

export const updateOrganizationValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({
      min: 2,
      max: 150,
    })
    .withMessage(
      'Organization name must be between 2 and 150 characters.',
    ),

  body('description')
    .optional()
    .trim()
    .isLength({
      max: 500,
    })
    .withMessage(
      'Description cannot exceed 500 characters.',
    ),

  body('industry')
    .optional()
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      'Industry cannot exceed 100 characters.',
    ),

  optionalEmailValidator,
  optionalPhoneValidator,
  optionalWebsiteValidator,
  optionalAddressValidator,

  body('status')
    .optional()
    .isIn(['active', 'suspended'])
    .withMessage(
      'Status must be either active or suspended.',
    ),
]