import MobileNumber from '../models/MobileNumber.js'

export const createNumber = async (req, res, next) => {
  try {
    const { label, countryCode, phoneNumber, ownershipStatus, suspectedRecycled, createdAt } = req.body

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required.',
      })
    }

    const existingNumber = await MobileNumber.findOne({ phoneNumber })
    if (existingNumber) {
      return res.status(400).json({
        success: false,
        message: 'A mobile number with this value already exists.',
      })
    }

    const number = await MobileNumber.create({
      userId: req.user._id,
      label,
      countryCode,
      phoneNumber,
      ownershipStatus,
      suspectedRecycled,
      createdAt: createdAt || new Date(),
    })

    return res.status(201).json({
      success: true,
      message: 'Mobile number created successfully.',
      data: { number },
    })
  } catch (error) {
    next(error)
  }
}

export const listNumbers = async (req, res, next) => {
  try {
    const numbers = await MobileNumber.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean()

    return res.status(200).json({
      success: true,
      count: numbers.length,
      data: { numbers },
    })
  } catch (error) {
    next(error)
  }
}

export default {
  createNumber,
  listNumbers,
}
