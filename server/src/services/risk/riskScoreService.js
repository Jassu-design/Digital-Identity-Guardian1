import Incident from '../../models/Incident.js'

const severityPoints = {
  low: 5,
  medium: 10,
  high: 20,
  critical: 30,
}

const getRiskLevel = score => {
  if (score >= 76) {
    return 'critical'
  }

  if (score >= 51) {
    return 'high'
  }

  if (score >= 26) {
    return 'medium'
  }

  return 'low'
}

const calculateIncidentPoints = incident => {
  if (incident.status === 'false_positive') {
    return 0
  }

  let points = severityPoints[incident.severity] || 0

  if (incident.analysis?.isSuspicious) {
    points += 10
  }

  if (incident.analysis?.hasExternalLink) {
    points += 8
  }

  if (incident.analysis?.hasOtp) {
    points += 5
  }

  const recycledNumberRelevance =
    incident.analysis?.recycledNumberRelevance || 0

  if (recycledNumberRelevance >= 75) {
    points += 15
  } else if (recycledNumberRelevance >= 50) {
    points += 10
  } else if (recycledNumberRelevance >= 25) {
    points += 5
  }

  if (incident.category === 'phishing') {
    points += 10
  }

  if (incident.category === 'identity_theft') {
    points += 15
  }

  if (incident.category === 'recycled_number') {
    points += 10
  }

  if (incident.status === 'resolved') {
    points = Math.round(points * 0.5)
  }

  return points
}

export const calculateUserRiskScore = async userId => {
  const incidents = await Incident.find({
    userId,
  }).lean()

  let totalPoints = 0

  const breakdown = {
    severityPoints: 0,
    suspiciousMessagePoints: 0,
    externalLinkPoints: 0,
    otpPoints: 0,
    recycledNumberPoints: 0,
    categoryPoints: 0,
    resolvedReduction: 0,
  }

  incidents.forEach(incident => {
    if (incident.status === 'false_positive') {
      return
    }

    const baseSeverityPoints =
      severityPoints[incident.severity] || 0

    breakdown.severityPoints += baseSeverityPoints

    let incidentPoints = baseSeverityPoints

    if (incident.analysis?.isSuspicious) {
      incidentPoints += 10
      breakdown.suspiciousMessagePoints += 10
    }

    if (incident.analysis?.hasExternalLink) {
      incidentPoints += 8
      breakdown.externalLinkPoints += 8
    }

    if (incident.analysis?.hasOtp) {
      incidentPoints += 5
      breakdown.otpPoints += 5
    }

    const recycledNumberRelevance =
      incident.analysis?.recycledNumberRelevance || 0

    let recycledPoints = 0

    if (recycledNumberRelevance >= 75) {
      recycledPoints = 15
    } else if (recycledNumberRelevance >= 50) {
      recycledPoints = 10
    } else if (recycledNumberRelevance >= 25) {
      recycledPoints = 5
    }

    incidentPoints += recycledPoints
    breakdown.recycledNumberPoints += recycledPoints

    let categoryPoints = 0

    if (incident.category === 'phishing') {
      categoryPoints = 10
    }

    if (incident.category === 'identity_theft') {
      categoryPoints = 15
    }

    if (incident.category === 'recycled_number') {
      categoryPoints = 10
    }

    incidentPoints += categoryPoints
    breakdown.categoryPoints += categoryPoints

    if (incident.status === 'resolved') {
      const reducedPoints = Math.round(incidentPoints * 0.5)

      breakdown.resolvedReduction +=
        incidentPoints - reducedPoints

      incidentPoints = reducedPoints
    }

    totalPoints += incidentPoints
  })

  const riskScore = Math.min(totalPoints, 100)
  const riskLevel = getRiskLevel(riskScore)

  return {
    riskScore,
    riskLevel,
    totalIncidents: incidents.length,
    activeIncidents: incidents.filter(
      incident =>
        incident.status === 'open' ||
        incident.status === 'investigating',
    ).length,
    resolvedIncidents: incidents.filter(
      incident => incident.status === 'resolved',
    ).length,
    falsePositiveIncidents: incidents.filter(
      incident => incident.status === 'false_positive',
    ).length,
    breakdown,
  }
}

export const calculateSingleIncidentRisk = incident => {
  const score = Math.min(
    calculateIncidentPoints(incident),
    100,
  )

  return {
    riskScore: score,
    riskLevel: getRiskLevel(score),
  }
}

export {getRiskLevel}