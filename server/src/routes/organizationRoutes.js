import express from 'express'

import {
  createOrganization,
  joinOrganization,
  getMyOrganization,
  updateOrganization,
  getOrganizationMembers,
  removeMember,
} from '../controllers/organizationController.js'

import {protect} from '../middleware/authMiddleware.js'
import {validateRequest} from '../middleware/validateMiddleware.js'

import {
  createOrganizationValidator,
  joinOrganizationValidator,
  updateOrganizationValidator,
} from '../validator/organizationValidator.js'

const router = express.Router()

// All organization routes require authentication
router.use(protect)

// Create Organization
router.post(
  '/',
  createOrganizationValidator,
  validateRequest,
  createOrganization,
)

// Join Organization
router.post(
  '/join',
  joinOrganizationValidator,
  validateRequest,
  joinOrganization,
)

// Get My Organization
router.get('/', getMyOrganization)

// Update Organization
router.patch(
  '/',
  updateOrganizationValidator,
  validateRequest,
  updateOrganization,
)

// Get Organization Members
router.get('/members', getOrganizationMembers)

// Remove Member
router.delete('/members/:userId', removeMember)

export default router