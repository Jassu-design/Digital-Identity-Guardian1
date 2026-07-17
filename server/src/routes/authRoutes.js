import express from 'express'
import {
  getCurrentUser,
  login,
  register,
} from '../controllers/authController.js'
import {protect} from '../middleware/authMiddleware.js'
import {validateRequest} from '../middleware/validateMiddleware.js'
import {
  loginValidator,
  registerValidator,
} from '../validator/authValidator.js'

const router = express.Router()

router.post(
  '/register',
  registerValidator,
  validateRequest,
  register,
)

router.post(
  '/login',
  loginValidator,
  validateRequest,
  login,
)

router.get('/me', protect, getCurrentUser)

export default router