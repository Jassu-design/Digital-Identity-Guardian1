import fs from 'fs/promises'
import Incident from '../models/Incident.js'
import {extractTextFromImage} from '../services/ocr/ocrServices.js'
import {analyzeMessageWithGemini} from '../services/ai/geminiService.js'

const createIncidentTitle = (category, sender) => {
  const formattedCategory = (category || 'other')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, character => character.toUpperCase())

  return `${formattedCategory} message from ${
    sender || 'Unknown sender'
  }`
}

const parseBoolean = value => {
  if (typeof value === 'boolean') {
    return value
  }

  return value === 'true'
}

export const extractTextWithOCR = async (req, res, next) => {
  let uploadedImagePath

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required.',
      })
    }

    uploadedImagePath = req.file.path

    const {
      language = 'eng',
      sender = 'Unknown',
      source = 'manual',
      title,
      mobileNumberId,
    } = req.body

    const analyzeWithAI = parseBoolean(req.body.analyzeWithAI)
    const saveAsIncident = parseBoolean(req.body.saveAsIncident)

    if (saveAsIncident && !analyzeWithAI) {
      return res.status(400).json({
        success: false,
        message:
          'analyzeWithAI must be true when saveAsIncident is enabled.',
      })
    }

    const ocrResult = await extractTextFromImage(
      uploadedImagePath,
      language,
    )

    let analysis = null
    let incident = null

    if (analyzeWithAI) {
      analysis = await analyzeMessageWithGemini({
        message: ocrResult.text,
        sender: sender.trim() || 'Unknown',
      })
    }

    if (saveAsIncident && analysis) {
      incident = await Incident.create({
        userId: req.user._id,
        mobileNumberId: mobileNumberId || undefined,

        title:
          title?.trim() ||
          createIncidentTitle(
            analysis.category,
            sender.trim() || 'Unknown',
          ),

        message: ocrResult.text,
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
          confidence: analysis.confidence,
        },

        status: 'open',
        source,
      })
    }

    return res.status(incident ? 201 : 200).json({
      success: true,
      message: incident
        ? 'Text extracted, analyzed and incident created successfully.'
        : analysis
          ? 'Text extracted and analyzed successfully.'
          : 'Text extracted successfully.',
      data: {
        ocr: ocrResult,
        analysis,
        incident,
      },
    })
  } catch (error) {
    next(error)
  } finally {
    if (uploadedImagePath) {
      try {
        await fs.unlink(uploadedImagePath)
      } catch (cleanupError) {
        console.error(
          'Uploaded image cleanup error:',
          cleanupError.message,
        )
      }
    }
  }
}