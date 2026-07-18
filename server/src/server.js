import dotenv from 'dotenv'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import app from './app.js'
import connectDatabase from './config/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({path: path.join(__dirname, '.env')})

const PORT = Number(process.env.PORT) || 3001

const startServer = async () => {
  try {
    await connectDatabase()

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()