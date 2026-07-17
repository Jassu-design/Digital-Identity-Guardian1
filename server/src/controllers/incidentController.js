import Incident from '../models/Incident.js'

/**
 * @desc    Create new incident
 * @route   POST /api/incidents
 * @access  Private
 */
export const createIncident = async (req, res, next) => {
  try {
    const {
      title,
      message,
      sender,
      category,
      severity,
      riskScore,
      analysis,
      mobileNumberId,
      source,
    } = req.body

    const incident = await Incident.create({
      userId: req.user._id,
      mobileNumberId: mobileNumberId || null,
      title,
      message,
      sender,
      category,
      severity,
      riskScore,
      analysis,
      source,
    })

    res.status(201).json({
      success: true,
      message: 'Incident created successfully.',
      data: {
        incident,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all incidents of logged-in user
 * @route   GET /api/incidents
 * @access  Private
 */
export const getIncidents = async (req, res, next) => {
  try {
    const incidents = await Incident.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate('mobileNumberId', 'label phoneNumber')

    res.status(200).json({
      success: true,
      data: {
        count: incidents.length,
        incidents,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get single incident
 * @route   GET /api/incidents/:id
 * @access  Private
 */
export const getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('mobileNumberId', 'label phoneNumber')

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found.',
      })
    }

    res.status(200).json({
      success: true,
      data: {
        incident,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Update incident status
 * @route   PATCH /api/incidents/:id/resolve
 * @access  Private
 */
export const resolveIncident = async (req, res, next) => {
  try {
    const { status, resolutionNote } = req.body

    const incident = await Incident.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found.',
      })
    }

    incident.status = status || 'resolved'

    if (resolutionNote) {
      incident.resolutionNote = resolutionNote
    }

    await incident.save()

    res.status(200).json({
      success: true,
      message: 'Incident updated successfully.',
      data: {
        incident,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Delete incident
 * @route   DELETE /api/incidents/:id
 * @access  Private
 */
export const deleteIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found.',
      })
    }

    await Incident.deleteOne({
      _id: incident._id,
    })

    res.status(200).json({
      success: true,
      message: 'Incident deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}