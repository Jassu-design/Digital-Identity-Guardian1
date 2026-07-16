import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import analysisRoutes from './routes/analysisRoutes.js'
import authRoutes from './routes/authRoutes.js'
import numberRoutes from './routes/numberRoutes.js'
import {
  errorHandler,
  notFoundHandler,
} from './middleware/errorMiddleware.js'

const app = express()

app.use(helmet())

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
)

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Digital Identity Guardian API is running',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/numbers', numberRoutes)
app.use('/api/analysis', analysisRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app