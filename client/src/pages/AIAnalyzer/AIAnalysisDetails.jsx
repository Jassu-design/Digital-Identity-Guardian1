import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {toast} from 'react-hot-toast'

import {
  deleteAnalysis,
  getAnalysisById,
} from '../../api/aiApi.js'

import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import ErrorMessage from '../../components/common/ErrorMessage.jsx'

import './AIAnalysisDetails.css'

const AIAnalysisDetails = () => {
  const {id} = useParams()
  const navigate = useNavigate()

  const [analysis, setAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAnalysis = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await getAnalysisById(id)

      const analysisData =
        response.data?.analysis ||
        response.data ||
        response.analysis ||
        response

      setAnalysis(analysisData)
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        'Unable to load AI analysis.'

      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [id])

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this analysis?',
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteAnalysis(id)

      toast.success('Analysis deleted successfully')
      navigate('/ai-history')
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          'Unable to delete analysis.',
      )
    }
  }

  const formatText = value => {
    if (!value) {
      return 'Unknown'
    }

    return String(value)
      .replaceAll('_', ' ')
      .replace(/\b\w/g, character =>
        character.toUpperCase(),
      )
  }

  if (isLoading) {
    return (
      <LoadingSpinner message="Loading analysis details..." />
    )
  }

  if (error) {
    return (
      <ErrorMessage
        title="Unable to load analysis"
        message={error}
        onRetry={fetchAnalysis}
      />
    )
  }

  if (!analysis) {
    return (
      <ErrorMessage
        title="Analysis not found"
        message="The requested AI analysis does not exist."
      />
    )
  }

  const riskScore =
    analysis.riskScore ??
    analysis.score ??
    analysis.analysis?.riskScore ??
    0

  const riskLevel =
    analysis.riskLevel ??
    analysis.severity ??
    analysis.analysis?.riskLevel ??
    'unknown'

  const message =
    analysis.text ||
    analysis.message ||
    analysis.originalText ||
    'Message not available'

  const explanation =
    analysis.explanation ||
    analysis.reason ||
    analysis.summary ||
    analysis.analysis?.explanation ||
    'No explanation was provided.'

  const recommendations =
    analysis.recommendations ||
    analysis.suggestions ||
    analysis.safetyTips ||
    analysis.analysis?.recommendations ||
    []

  const threats =
    analysis.detectedThreats ||
    analysis.threats ||
    analysis.analysis?.detectedThreats ||
    []

  return (
    <div className="analysis-details-container">
      <div className="analysis-details-header">
        <div>
          <h1>AI Analysis Details</h1>

          <p>
            Complete security analysis of the selected
            message.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/ai-history')}
        >
          Back to History
        </button>
      </div>

      <section className="analysis-risk-card">
        <div>
          <p>Risk Score</p>
          <h2>{riskScore}/100</h2>
        </div>

        <span
          className={`analysis-risk-level risk-${String(
            riskLevel,
          ).toLowerCase()}`}
        >
          {formatText(riskLevel)} Risk
        </span>
      </section>

      <section className="analysis-details-card">
        <div className="analysis-detail-item">
          <h3>Sender</h3>

          <p>
            {analysis.sender ||
              analysis.source ||
              'Unknown'}
          </p>
        </div>

        <div className="analysis-detail-item">
          <h3>Category</h3>

          <p>
            {formatText(
              analysis.category ||
                analysis.analysis?.category,
            )}
          </p>
        </div>

        <div className="analysis-detail-item full-width">
          <h3>Analyzed Message</h3>

          <p>{message}</p>
        </div>

        <div className="analysis-detail-item full-width">
          <h3>AI Explanation</h3>

          <p>{explanation}</p>
        </div>

        {Array.isArray(threats) && threats.length > 0 && (
          <div className="analysis-detail-item full-width">
            <h3>Detected Threats</h3>

            <ul>
              {threats.map((threat, index) => (
                <li key={`${threat}-${index}`}>
                  {formatText(threat)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="analysis-detail-item full-width">
          <h3>Safety Recommendations</h3>

          {Array.isArray(recommendations) &&
          recommendations.length > 0 ? (
            <ul>
              {recommendations.map(
                (recommendation, index) => (
                  <li
                    key={`${recommendation}-${index}`}
                  >
                    {recommendation}
                  </li>
                ),
              )}
            </ul>
          ) : (
            <p>No recommendations were provided.</p>
          )}
        </div>

        <div className="analysis-detail-item">
          <h3>Analyzed On</h3>

          <p>
            {analysis.createdAt
              ? new Date(
                  analysis.createdAt,
                ).toLocaleString('en-IN')
              : 'Date not available'}
          </p>
        </div>
      </section>

      <div className="analysis-details-actions">
        <button
          type="button"
          onClick={() => navigate('/ai-analyzer')}
        >
          Analyze Another Message
        </button>

        <button
          type="button"
          onClick={handleDelete}
        >
          Delete Analysis
        </button>
      </div>
    </div>
  )
}

export default AIAnalysisDetails