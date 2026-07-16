const phraseDefinitions = [
  {
    category: 'phishing',
    weight: 18,
    phrases: [
      /\bverify your account\b/i,
      /\baccount suspended\b/i,
      /\bsecurity alert\b/i,
      /\bconfirm your identity\b/i,
      /\bcredentials\b/i,
      /\blogin to your account\b/i,
      /\bupdate your account\b/i,
      /\bclick here\b/i,
      /\bpassword\b/i,
      /\bsocial security\b/i,
      /\bssn\b/i,
      /\baccount locked\b/i,
      /\breactivate your account\b/i,
    ],
  },
  {
    category: 'fraud',
    weight: 16,
    phrases: [
      /\bverification code\b/i,
      /\botp\b/i,
      /\bsecurity code\b/i,
      /\bcard details\b/i,
      /\baccount number\b/i,
      /\bcredit card\b/i,
      /\bbank account\b/i,
      /\bconfirm.*(password|pin|code|ssn|identity)/i,
      /\bprovide.*(password|pin|code|ssn|account number)/i,
    ],
  },
  {
    category: 'scam',
    weight: 14,
    phrases: [
      /\byou have won\b/i,
      /\bclaim your prize\b/i,
      /\bfree gift\b/i,
      /\blottery\b/i,
      /\bcongratulations\b/i,
      /\bprize\b/i,
      /\bwire transfer\b/i,
      /\bbitcoin\b/i,
      /\bcrypto\b/i,
      /\binvest now\b/i,
      /\brefund\b/i,
      /\bpayment pending\b/i,
    ],
  },
  {
    category: 'urgent',
    weight: 8,
    phrases: [
      /\burgent\b/i,
      /\bimmediately\b/i,
      /\bnow\b/i,
      /\bfinal notice\b/i,
      /\blast chance\b/i,
      /\bas soon as possible\b/i,
      /\bwithin 24 hours\b/i,
      /\bdeadline\b/i,
    ],
  },
  {
    category: 'harassment',
    weight: 12,
    phrases: [
      /\bidiot\b/i,
      /\bstupid\b/i,
      /\bloser\b/i,
      /\bshut up\b/i,
      /\bkill you\b/i,
      /\bdie\b/i,
      /\bfuck you\b/i,
      /\bscrew you\b/i,
    ],
  },
  {
    category: 'sensitive',
    weight: 12,
    phrases: [
      /\bpassport\b/i,
      /\bdriver['’]?s license\b/i,
      /\btax id\b/i,
      /\bbirth certificate\b/i,
      /\bgovernment id\b/i,
    ],
  },
  {
    category: 'spam',
    weight: 10,
    phrases: [
      /\bcheap\b/i,
      /\bbuy now\b/i,
      /\blowout sale\b/i,
      /\bact now\b/i,
      /\blimited time\b/i,
      /\bno obligation\b/i,
      /\blose weight\b/i,
      /\bwork from home\b/i,
      /\brequest.*bank details\b/i,
    ],
  },
]

const safePhrases = [
  /\bthank you\b/i,
  /\bthanks\b/i,
  /\bhello\b/i,
  /\bhi\b/i,
  /\bgood morning\b/i,
  /\bgood afternoon\b/i,
  /\bregards\b/i,
]

const buildRecommendation = (riskLevel) => {
  if (riskLevel === 'high-risk') {
    return 'Do not respond. Verify the sender through another channel or ignore this message.'
  }

  if (riskLevel === 'medium-risk') {
    return 'Proceed with caution. Verify the sender and confirm requests before taking action.'
  }

  return 'Message appears low risk, but remain alert and verify any unusual requests.'
}

export const analyzeMessageDeterministic = (message) => {
  const trimmedMessage = typeof message === 'string' ? message.trim() : ''

  if (!trimmedMessage) {
    return {
      categories: ['unknown'],
      flaggedPhrases: [],
      riskScore: 0,
      riskLevel: 'unknown',
      recommendation: 'No text was provided for analysis.',
      reasons: ['Empty message.'],
      normalizedMessage: '',
      rawMessage: message,
    }
  }

  const normalizedMessage = trimmedMessage.replace(/\s+/g, ' ').trim()
  const detected = []
  const flaggedPhrases = new Set()
  const categories = new Set()
  let score = 0

  for (const definition of phraseDefinitions) {
    for (const phrase of definition.phrases) {
      if (phrase.test(normalizedMessage)) {
        const label = phrase.source
          .replace(/\\b/g, '')
          .replace(/\^/g, '')
          .replace(/\b/i, '')
          .trim()

        flaggedPhrases.add(label || phrase.source)
        categories.add(definition.category)
        score += definition.weight
        detected.push({ category: definition.category, phrase: label || phrase.source, weight: definition.weight })
        break
      }
    }
  }

  const safeMatch = safePhrases.some((phrase) => phrase.test(normalizedMessage))

  if (categories.size === 0 && safeMatch) {
    categories.add('safe')
  }

  if (detected.length === 0 && !safeMatch) {
    categories.add('unknown')
  }

  if (categories.has('phishing') || categories.has('scam') || categories.has('fraud')) {
    score += 8
  }

  if (categories.has('urgent')) {
    score += 4
  }

  score = Math.min(100, Math.max(0, score))

  const riskLevel = score >= 60 ? 'high-risk' : score >= 30 ? 'medium-risk' : score > 0 ? 'low-risk' : 'unknown'

  const reasons = []
  if (detected.length > 0) {
    for (const item of detected) {
      reasons.push(`Detected ${item.category} indicator: "${item.phrase}".`)
    }
  } else if (safeMatch) {
    reasons.push('The message contains normal conversational language and no suspicious indicators were matched.')
  } else {
    reasons.push('No deterministic risk indicators were matched. Review manually if the content is sensitive.')
  }

  return {
    rawMessage: trimmedMessage,
    normalizedMessage,
    categories: Array.from(categories),
    flaggedPhrases: Array.from(flaggedPhrases),
    riskScore: score,
    riskLevel,
    recommendation: buildRecommendation(riskLevel),
    reasons,
    detectedPatterns: detected,
  }
}
