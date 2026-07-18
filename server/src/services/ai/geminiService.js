import {GoogleGenAI} from '@google/genai'

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing from environment variables.')
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  })
}

const removeMarkdownCodeBlock = text =>
  text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

const parseGeminiResponse = responseText => {
  try {
    const cleanedText = removeMarkdownCodeBlock(responseText)
    return JSON.parse(cleanedText)
  } catch {
    throw new Error('Gemini returned an invalid JSON response.')
  }
}

export const analyzeMessageWithGemini = async ({
  message,
  sender = 'Unknown',
}) => {
  if (!message || typeof message !== 'string') {
    throw new Error('A valid message is required for AI analysis.')
  }

  const ai = getGeminiClient()

  const prompt = `
You are a cybersecurity assistant for a digital identity protection platform.

Analyze the following SMS or digital message for fraud, phishing,
identity theft, OTP theft, banking scams, recycled-number risks,
malicious links, impersonation, and social engineering.

Sender:
${sender}

Message:
${message}

Return only valid JSON using exactly this structure:

{
  "isSuspicious": true,
  "category": "phishing",
  "severity": "high",
  "riskScore": 80,
  "hasOtp": false,
  "hasExternalLink": true,
  "detectedUrls": [],
  "detectedKeywords": [],
  "explanation": "Clear explanation of why the message is risky.",
  "recommendations": [
    "First recommended safety action.",
    "Second recommended safety action."
  ],
  "recycledNumberRelevance": 0,
  "confidence": 90
}

Rules:

1. category must be one of:
   "banking",
   "phishing",
   "identity_theft",
   "recycled_number",
   "otp",
   "delivery",
   "social_media",
   "loan",
   "job",
   "other"

2. severity must be one of:
   "low",
   "medium",
   "high",
   "critical"

3. riskScore must be an integer from 0 to 100.

4. recycledNumberRelevance must be an integer from 0 to 100.

5. confidence must be an integer from 0 to 100.

6. detectedUrls and detectedKeywords must always be arrays.

7. recommendations must contain clear and practical safety actions.

8. Do not include markdown, code fences, comments, or text outside JSON.
`

  try {
    console.log("Model:",process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite');
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    })

    if (!response.text) {
      throw new Error('Gemini returned an empty response.')
    }

    const analysis = parseGeminiResponse(response.text)

    return {
      isSuspicious: Boolean(analysis.isSuspicious),

      category:
        typeof analysis.category === 'string'
          ? analysis.category
          : 'other',

      severity:
        typeof analysis.severity === 'string'
          ? analysis.severity
          : 'medium',

      riskScore: Math.min(
        Math.max(Number(analysis.riskScore) || 0, 0),
        100,
      ),

      hasOtp: Boolean(analysis.hasOtp),

      hasExternalLink: Boolean(
        analysis.hasExternalLink,
      ),

      detectedUrls: Array.isArray(analysis.detectedUrls)
        ? analysis.detectedUrls
        : [],

      detectedKeywords: Array.isArray(
        analysis.detectedKeywords,
      )
        ? analysis.detectedKeywords
        : [],

      explanation:
        analysis.explanation ||
        'No explanation was provided.',

      recommendations: Array.isArray(
        analysis.recommendations,
      )
        ? analysis.recommendations
        : [],

      recycledNumberRelevance: Math.min(
        Math.max(
          Number(analysis.recycledNumberRelevance) || 0,
          0,
        ),
        100,
      ),

      confidence: Math.min(
        Math.max(Number(analysis.confidence) || 0, 0),
        100,
      ),

      analyzedBy: 'gemini',
    }
  } catch (error) {
    console.error(
      'Gemini analysis error:',
      error.message,
    )

    throw new Error(
      'AI message analysis failed. Please try again.',
    )
  }
}