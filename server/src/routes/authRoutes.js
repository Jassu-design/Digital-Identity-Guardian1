import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '7d',
  })
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with that email already exists.',
      })
    }

    const user = await User.create({ name, email, password })
    const token = generateToken(user._id)

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      data: { user },
    })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    const token = generateToken(user._id)

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      data: { user },
    })
  } catch (error) {
    next(error)
  }
})

router.get('/me', protect, async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  })
})

export default router
