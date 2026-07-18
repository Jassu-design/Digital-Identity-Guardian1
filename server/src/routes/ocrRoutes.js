import express from 'express'
import {extractTextWithOCR} from '../controllers/ocrController.js'
import {protect} from '../middleware/authMiddleware.js'
import {uploadImage} from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.use(protect)

router.post(
  '/extract',
  uploadImage.single('image'),
  extractTextWithOCR,
)

export default router