import Incident from '../models/Incident.js'
import {calculateUserRiskScore} from '../services/risk/riskScoreService.js'

export const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id

    const [
      riskSummary,
      totalIncidents,
      openIncidents,
      investigatingIncidents,
      resolvedIncidents,
      falsePositiveIncidents,
      criticalIncidents,
      highIncidents,
      recentIncidents,
      categoryBreakdown,
      severityBreakdown,
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
        status: {
          $ne: 'false_positive',
        },
      }),

      Incident.countDocuments({
        userId,
        severity: 'high',
        status: {
          $ne: 'false_positive',
        },
      }),

      Incident.find({userId})
        .sort({createdAt: -1})
        .limit(5)
        .select(
          'title sender category severity riskScore status source createdAt',
        )
        .lean(),

      Incident.aggregate([
        {
          $match: {
            userId,
            status: {
              $ne: 'false_positive',
            },
          },
        },
        {
          $group: {
            _id: '$category',
            count: {
              $sum: 1,
            },
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
            status: {
              $ne: 'false_positive',
            },
          },
        },
        {
          $group: {
            _id: '$severity',
            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ])

    const formattedCategoryBreakdown =
      categoryBreakdown.reduce((result, item) => {
        result[item._id || 'other'] = item.count
        return result
      }, {})

    const formattedSeverityBreakdown = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    }

    severityBreakdown.forEach(item => {
      if (item._id) {
        formattedSeverityBreakdown[item._id] = item.count
      }
    })

    const activeIncidents =
      openIncidents + investigatingIncidents

    return res.status(200).json({
      success: true,
      message: 'Dashboard data fetched successfully.',
      data: {
        risk: riskSummary,

        incidents: {
          total: totalIncidents,
          active: activeIncidents,
          open: openIncidents,
          investigating: investigatingIncidents,
          resolved: resolvedIncidents,
          falsePositive: falsePositiveIncidents,
          critical: criticalIncidents,
          high: highIncidents,
        },

        categoryBreakdown:
          formattedCategoryBreakdown,

        severityBreakdown:
          formattedSeverityBreakdown,

        recentIncidents,
      },
    })
  } catch (error) {
    next(error)
  }
}