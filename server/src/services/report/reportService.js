import Incident from '../../models/Incident.js'
import {calculateUserRiskScore} from '../risk/riskScoreService.js'

const createSecurityRecommendations = ({
  riskLevel,
  criticalIncidents,
  highIncidents,
  phishingIncidents,
  otpIncidents,
  unresolvedIncidents,
}) => {
  const recommendations = []

  if (riskLevel === 'critical') {
    recommendations.push(
      'Immediately review all active incidents and secure important accounts.',
    )
  }

  if (riskLevel === 'high') {
    recommendations.push(
      'Change passwords for sensitive accounts and enable two-factor authentication.',
    )
  }

  if (criticalIncidents > 0) {
    recommendations.push(
      'Prioritize critical incidents and verify affected banking, email, and social media accounts.',
    )
  }

  if (highIncidents > 0) {
    recommendations.push(
      'Investigate high-severity incidents and avoid interacting with suspicious senders.',
    )
  }

  if (phishingIncidents > 0) {
    recommendations.push(
      'Do not click unknown links and always verify website domains before entering personal information.',
    )
  }

  if (otpIncidents > 0) {
    recommendations.push(
      'Never share OTPs, verification codes, PINs, or account passwords.',
    )
  }

  if (unresolvedIncidents > 0) {
    recommendations.push(
      'Review and resolve open incidents to maintain an accurate digital risk profile.',
    )
  }

  recommendations.push(
    'Enable two-factor authentication on important accounts.',
  )

  recommendations.push(
    'Regularly review account login activity and connected devices.',
  )

  return [...new Set(recommendations)]
}

const formatBreakdown = items => {
  return items.reduce((result, item) => {
    result[item._id || 'other'] = item.count
    return result
  }, {})
}

export const generateUserSecurityReport = async userId => {
  const [
    riskSummary,
    totalIncidents,
    openIncidents,
    investigatingIncidents,
    resolvedIncidents,
    falsePositiveIncidents,
    criticalIncidents,
    highIncidents,
    phishingIncidents,
    otpIncidents,
    categoryBreakdown,
    severityBreakdown,
    recentIncidents,
  ] = await Promise.all([
    calculateUserRiskScore(userId),

    Incident.countDocuments({userId}),

    Incident.countDocuments({
      userId,
      status: 'open',
    }),

    Incident.countDocuments({
      userId,
      status: 'investigating',
    }),

    Incident.countDocuments({
      userId,
      status: 'resolved',
    }),

    Incident.countDocuments({
      userId,
      status: 'false_positive',
    }),

    Incident.countDocuments({
      userId,
      severity: 'critical',
      status: {$ne: 'false_positive'},
    }),

    Incident.countDocuments({
      userId,
      severity: 'high',
      status: {$ne: 'false_positive'},
    }),

    Incident.countDocuments({
      userId,
      category: 'phishing',
      status: {$ne: 'false_positive'},
    }),

    Incident.countDocuments({
      userId,
      category: 'otp',
      status: {$ne: 'false_positive'},
    }),

    Incident.aggregate([
      {
        $match: {
          userId,
          status: {$ne: 'false_positive'},
        },
      },
      {
        $group: {
          _id: '$category',
          count: {$sum: 1},
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]),

    Incident.aggregate([
      {
        $match: {
          userId,
          status: {$ne: 'false_positive'},
        },
      },
      {
        $group: {
          _id: '$severity',
          count: {$sum: 1},
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]),

    Incident.find({userId})
      .sort({createdAt: -1})
      .limit(10)
      .select(
        'title sender category severity riskScore status source createdAt resolvedAt',
      )
      .lean(),
  ])

  const unresolvedIncidents =
    openIncidents + investigatingIncidents

  const recommendations = createSecurityRecommendations({
    riskLevel: riskSummary.riskLevel,
    criticalIncidents,
    highIncidents,
    phishingIncidents,
    otpIncidents,
    unresolvedIncidents,
  })

  return {
    generatedAt: new Date(),

    risk: riskSummary,

    incidentSummary: {
      total: totalIncidents,
      unresolved: unresolvedIncidents,
      open: openIncidents,
      investigating: investigatingIncidents,
      resolved: resolvedIncidents,
      falsePositive: falsePositiveIncidents,
      critical: criticalIncidents,
      high: highIncidents,
    },

    categoryBreakdown: formatBreakdown(categoryBreakdown),

    severityBreakdown: formatBreakdown(severityBreakdown),

    recentIncidents,

    recommendations,
  }
}