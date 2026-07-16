import express from 'express'
import { createNumber, listNumbers } from '../controllers/numberController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, createNumber)
router.get('/', protect, listNumbers)

export default router
