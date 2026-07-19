import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {toast} from 'react-hot-toast'

import {
  deleteAnalysis,
  getAnalysisHistory,
} from '../../api/aiApi.js'

import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import ErrorMessage from '../../components/common/ErrorMessage.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

import './AIHistory.css'

const AIHistory = () => {
  const [analyses, setAnalyses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAnalysisHistory = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await getAnalysisHistory()

      const historyData =
        response.data?.analyses ||
        response.data?.history ||
        response.data ||
        response.analyses ||
        response.history ||
        []

      setAnalyses(
        Array.isArray(historyData) ? historyData : [],
      )
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        'Unable to load AI analysis history.'

      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysisHistory()
  }, [])

  const handleDelete = async analysisId => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this analysis?',
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteAnalysis(analysisId)

      setAnalyses(currentAnalyses =>
        currentAnalyses.filter(
          analysis => analysis._id !== analysisId,
        ),
      )

      toast.success('Analysis deleted successfully')
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

  const formatDate = dateValue => {
    if (!dateValue) {
      return 'Date not available'
    }

    return new Date(dateValue).toLocaleString('en-IN')
  }

  if (isLoading) {
    return (
      <LoadingSpinner message="Loading AI history..." />
    )
  }

  if (error) {
    return (
      <ErrorMessage
        title="Unable to load AI history"
        message={error}
        onRetry={fetchAnalysisHistory}
      />
    )
  }

  return (
    <div className="ai-history-container">
      <div className="ai-history-header">
        <div>
          <h1>AI Analysis History</h1>

          <p>
            Review messages previously checked by the AI
            security analyzer.
          </p>
        </div>

        <Link
          to="/ai-analyzer"
          className="new-analysis-button"
        >
          New Analysis
        </Link>
      </div>

      {analyses.length === 0 ? (
        <EmptyState
          title="No AI analyses found"
          message="Analyze a suspicious message to create your first record."
          actionText="Analyze Message"
          actionPath="/ai-analyzer"
        />
      ) : (
        <div className="ai-history-list">
          {analyses.map(analysis => {
            const riskScore =
              analysis.riskScore ??
              analysis.score ??
              analysis.analysis?.riskScore ??
              0

            const riskLevel =
              analysis.riskLevel ??
              analysis.severity ??
              
              'unknown'

            const message =
              analysis.text ||
              analysis.message ||
              analysis.originalText ||
              'Message not available'

            return (
              <article
                className="ai-history-card"
                key={analysis._id}
              >
                <div className="ai-history-main">
                  <div className="ai-history-title">
                    <h2>
                      {analysis.sender ||
                        analysis.source ||
                        'Unknown sender'}
                    </h2>

                    <span
                      className={`risk-level risk-${String(
                        riskLevel,
                      ).toLowerCase()}`}
                    >
                      {formatText(riskLevel)} Risk
                    </span>
                  </div>

                  <p className="ai-history-message">
                    {message}
                  </p>

                  <div className="ai-history-meta">
                    <span>
                      Risk score: {riskScore}/100
                    </span>

                    <span>
                      {formatDate(analysis.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="ai-history-actions">
                  <Link
                    to={`/ai-history/${analysis._id}`}
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(analysis._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AIHistory