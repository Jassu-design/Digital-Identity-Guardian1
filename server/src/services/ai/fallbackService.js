const BANKING_KEYWORDS = [
  'bank',
  'sbi',
  'hdfc',
  'icici',
  'axis bank',
  'account',
  'debit',
  'credit',
  'transaction',
  'payment',
  'upi',
]

const HEALTH_KEYWORDS = [
  'hospital',
  'doctor',
  'appointment',
  'medical',
  'clinic',
  'health',
]

const DELIVERY_KEYWORDS = [
  'order',
  'delivery',
  'shipped',
  'package',
  'courier',
  'amazon',
  'flipkart',
]

const GOVERNMENT_KEYWORDS = [
  'government',
  'aadhaar',
  'pan card',
  'income tax',
  'passport',
  'driving licence',
]

const SCAM_KEYWORDS = [
  'account blocked',
  'account suspended',
  'urgent action',
  'verify immediately',
  'claim reward',
  'winner',
  'lottery',
  'click here',
]

const containsAnyKeyword = (text, keywords) =>
  keywords.some(keyword => text.includes(keyword))

const detectUrls = message => {
  const urlRegex = /(https?:\/\/[^\s]+)/gi
  return message.match(urlRegex) || []
}

const detectOtp = message => {
  const otpKeywordRegex = /\b(otp|verification code|security code)\b/i
  const numericCodeRegex = /\b\d{4,8}\b/

  return otpKeywordRegex.test(message) && numericCodeRegex.test(message)
}

const calculateSeverity = ({
  hasOtp,
  hasBankingContent,
  hasSuspiciousLink,
  hasScamKeywords,
  hasSensitiveContent,
}) => {
  if (hasSuspiciousLink && hasScamKeywords) {
    return 'critical'
  }

  if (hasOtp && hasBankingContent) {
    return 'high'
  }

  if (hasSensitiveContent || hasScamKeywords) {
    return 'medium'
  }

  return 'low'
}

const getRecommendations = severity => {
  const recommendations = {
    low: [
      'Review the message carefully.',
      'Do not share personal information with unknown senders.',
    ],
    medium: [
      'Do not reply until the sender is verified.',
      'Avoid sharing personal or account information.',
      'Save the message as an incident if it was meant for another person.',
    ],
    high: [
      'Do not share the OTP or verification code.',
      'Do not attempt to access another person’s account.',
      'Verify the message using the organization’s official website or app.',
      'Save the incident and monitor for repeated messages.',
    ],
    critical: [
      'Do not open the link.',
      'Do not reply to the sender.',
      'Block and report the sender.',
      'Verify the claim through the organization’s official website or app.',
      'Save the incident immediately.',
    ],
  }

  return recommendations[severity]
}

export const analyzeMessageWithRules = message => {
  if (!message || typeof message !== 'string') {
    throw new Error('A valid message is required')
  }

  const trimmedMessage = message.trim()

  if (!trimmedMessage) {
    throw new Error('Message cannot be empty')
  }

  const normalizedText = trimmedMessage.toLowerCase()
  const detectedUrls = detectUrls(trimmedMessage)

  const hasOtp = detectOtp(trimmedMessage)
  const hasBankingContent = containsAnyKeyword(
    normalizedText,
    BANKING_KEYWORDS,
  )
  const hasHealthContent = containsAnyKeyword(
    normalizedText,
    HEALTH_KEYWORDS,
  )
  const hasDeliveryContent = containsAnyKeyword(
    normalizedText,
    DELIVERY_KEYWORDS,
  )
  const hasGovernmentContent = containsAnyKeyword(
    normalizedText,
    GOVERNMENT_KEYWORDS,
  )
  const hasScamKeywords = containsAnyKeyword(
    normalizedText,
    SCAM_KEYWORDS,
  )
  const hasSuspiciousLink = detectedUrls.length > 0

  let category = 'unknown'
  const warningSigns = []
  const sensitiveDataTypes = []

  if (hasBankingContent) {
    category = 'banking'
    warningSigns.push('Banking-related content detected')
  } else if (hasHealthContent) {
    category = 'healthcare'
    warningSigns.push('Healthcare-related information detected')
  } else if (hasDeliveryContent) {
    category = 'delivery'
    warningSigns.push('Delivery or order information detected')
  } else if (hasGovernmentContent) {
    category = 'government'
    warningSigns.push('Government-related information detected')
  }

  if (hasOtp) {
    category = category === 'unknown' ? 'otp' : category
    warningSigns.push('OTP or verification code detected')
    sensitiveDataTypes.push('otp')
  }

  if (hasSuspiciousLink) {
    warningSigns.push('External link detected')
    sensitiveDataTypes.push('url')
  }

  if (hasScamKeywords) {
    category = 'phishing'
    warningSigns.push('Common scam or phishing language detected')
  }

  if (hasBankingContent) {
    sensitiveDataTypes.push('financial_information')
  }

  if (hasHealthContent) {
    sensitiveDataTypes.push('health_information')
  }

  const hasSensitiveContent =
    hasOtp ||
    hasBankingContent ||
    hasHealthContent ||
    hasGovernmentContent

  const severity = calculateSeverity({
    hasOtp,
    hasBankingContent,
    hasSuspiciousLink,
    hasScamKeywords,
    hasSensitiveContent,
  })

  const phishingProbability =
    severity === 'critical'
      ? 90
      : hasScamKeywords
        ? 70
        : hasSuspiciousLink
          ? 50
          : 10

  const recycledNumberRelevance =
    hasOtp || hasHealthContent || hasDeliveryContent || hasGovernmentContent
      ? 70
      : 20

  return {
    summary:
      warningSigns.length > 0
        ? 'The message contains potentially sensitive or suspicious content.'
        : 'No major risk pattern was detected.',
    category,
    severity,
    confidence: 75,
    phishingProbability,
    recycledNumberRelevance,
    privacyRisk: hasSensitiveContent ? 75 : 20,
    detectedUrls,
    sensitiveDataTypes: [...new Set(sensitiveDataTypes)],
    warningSigns,
    recommendedActions: getRecommendations(severity),
    analysisSource: 'rule-based-fallback',
  }
}