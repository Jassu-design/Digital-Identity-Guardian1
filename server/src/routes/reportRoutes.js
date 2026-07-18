import express from 'express'
import {getSecurityReport} from '../controllers/reportController.js'
import {protect} from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/', getSecurityReport)

export default router