import express from 'express'

import {
  createIncident,
  deleteIncident,
  getIncidentById,
  getIncidents,
  resolveIncident,
} from '../controllers/incidentController.js'

import { protect } from '../middleware/authMiddleware.js'
import { validateRequest } from '../middleware/validateMiddleware.js'

import {
  createIncidentValidator,
  resolveIncidentValidator,
} from '../validator/incidentValidator.js'

const router = express.Router()

// Protect all incident routes
router.use(protect)

/**
 * POST    /api/incidents
 * GET     /api/incidents
 */
router
  .route('/')
  .post(
    createIncidentValidator,
    validateRequest,
    createIncident,
  )
  .get(getIncidents)

/**
 * GET     /api/incidents/:id
 * DELETE  /api/incidents/:id
 */
router
  .route('/:id')
  .get(getIncidentById)
  .delete(deleteIncident)

/**
 * PATCH   /api/incidents/:id/resolve
 */
router.patch(
  '/:id/resolve',
  resolveIncidentValidator,
  validateRequest,
  resolveIncident,
)

export default router