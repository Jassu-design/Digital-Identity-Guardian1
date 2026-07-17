import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = userId =>
  jwt.sign(
    {id: userId},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRES_IN || '7d'},
  )

export const register = async (req, res, next) => {
  try {
    const {name, email, password} = req.body

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await User.findOne({email: normalizedEmail})

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      })
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    })

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token: generateToken(user._id),
      data: {user},
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const {email, password} = req.body

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    })

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token: generateToken(user._id),
      data: {user},
    })
  } catch (error) {
    next(error)
  }
}

export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {user: req.user},
  })
}