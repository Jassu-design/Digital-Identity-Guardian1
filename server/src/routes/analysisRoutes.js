import express from 'express'
import {analyzeTextMessage} from '../controllers/analysisController.js'
import {protect} from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/text', protect, analyzeTextMessage)

export default router