import express from 'express'
import {analyzeMessageWithAI} from '../controllers/aiAnalysisController.js'
import {protect} from '../middleware/authMiddleware.js'
import {validateRequest} from '../middleware/validateMiddleware.js'
import {aiAnalysisValidator} from '../validator/aiAnalysisValidator.js'

const router = express.Router()

router.use(protect)

router.post(
  '/message',
  aiAnalysisValidator,
  validateRequest,
  analyzeMessageWithAI,
)

export default router