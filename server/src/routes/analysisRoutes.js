import express from 'express'
import {analyzeTextMessage} from '../controllers/analysisController.js'

const router = express.Router()

router.post('/text', analyzeTextMessage)

export default router