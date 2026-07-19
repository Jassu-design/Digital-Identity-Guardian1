import dotenv from 'dotenv'

dotenv.config()

import app from './app.js'
import connectDatabase from './config/db.js'

const PORT = process.env.PORT || 3001

const startServer = async () => {
  try {
    await connectDatabase()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error(
      'Failed to start server:',
      error.message,
    )

    process.exit(1)
  }
}

startServer()