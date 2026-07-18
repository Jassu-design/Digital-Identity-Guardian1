import Incident from '../models/Incident.js'
import {analyzeMessageWithGemini} from '../services/ai/geminiService.js'

const createIncidentTitle = (category, sender) => {
  const formattedCategory = category
    .replaceAll('_', ' ')
    .replace(/\b\w/g, character => character.toUpperCase())

  return `${formattedCategory} message from ${sender || 'Unknown sender'}`
}

export const analyzeMessageWithAI = async (req, res, next) => {
  try {
    const {
      message,
      sender = 'Unknown',
      mobileNumberId,
      saveAsIncident = false,
      title,
      source = 'sms',
    } = req.body

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required.',
      })
    }

    const analysis = await analyzeMessageWithGemini({
      message: message.trim(),
      sender: sender.trim() || 'Unknown',
    })

    let incident = null

    if (saveAsIncident) {
      incident = await Incident.create({
        userId: req.user._id,
        mobileNumberId: mobileNumberId || undefined,

        title:
          title?.trim() ||
          createIncidentTitle(
            analysis.category,
            sender.trim() || 'Unknown',
          ),

        message: message.trim(),
        sender: sender.trim() || 'Unknown',
        category: analysis.category,
        severity: analysis.severity,
        riskScore: analysis.riskScore,

        analysis: {
          isSuspicious: analysis.isSuspicious,
          hasOtp: analysis.hasOtp,
          hasExternalLink: analysis.hasExternalLink,
          detectedUrls: analysis.detectedUrls,
          detectedKeywords: analysis.detectedKeywords,
          explanation: analysis.explanation,
          recommendations: analysis.recommendations,
          recycledNumberRelevance:
            analysis.recycledNumberRelevance,
          analyzedBy: analysis.analyzedBy,
        },

        status: 'open',
        source,
      })
    }

    return res.status(incident ? 201 : 200).json({
      success: true,
      message: incident
        ? 'Message analyzed and incident created successfully.'
        : 'Message analyzed successfully.',
      data: {
        analysis,
        incident,
      },
    })
  } catch (error) {
    next(error)
  }
}