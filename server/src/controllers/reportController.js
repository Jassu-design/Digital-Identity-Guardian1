import {generateUserSecurityReport} from '../services/report/reportService.js'

export const getSecurityReport = async (req, res, next) => {
  try {
    const report = await generateUserSecurityReport(
      req.user._id,
    )

    return res.status(200).json({
      success: true,
      message: 'Security report generated successfully.',
      data: {
        report,
      },
    })
  } catch (error) {
    next(error)
  }
}