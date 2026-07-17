import {analyzeMessageWithRules} from '../services/ai/fallbackService.js'

export const analyzeTextMessage = async (req, res, next) => {
  try {
    const {message} = req.body

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        sucess: false,
        message: 'Message is required',
      })
    }

    if (message.trim().length < 3) {
      return res.status(400).json({
        message: 'Message must contain at least 3 characters',
      })
    }

    if (message.length > 5000) {
      return res.status(400).json({
        message: 'Message must not exceed 5000 characters',
      })
    }

    const result = analyzeMessageWithRules(message)

    return res.status(200).json({
      sucess: true,
      message: 'Message analyzed successfully',
      analysis: result,
    })
  } catch (error) {
    next(error)
  }
}