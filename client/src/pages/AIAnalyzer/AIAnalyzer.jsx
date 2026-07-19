import {useState} from 'react'
import {toast} from 'react-hot-toast'

import {analyzeText} from '../../api/aiApi.js'
import './AIAnalyzer.css'

const AIAnalyzer = () => {
  const [message, setMessage] = useState('')
  const [sender, setSender] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async event => {
    event.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      setError('Please enter a suspicious message.')
      return
    }

    try {
      setIsAnalyzing(true)
      setError('')
      setAnalysis(null)

      const response = await analyzeText({
        message: trimmedMessage,
        sender: sender.trim() || 'Unknown',
        source: 'manual',
      })
      setAnalysis(
        response.data?.analysis ||
          response.analysis ||
          response,
      )

      toast.success('Message analyzed successfully')
    } catch (requestError) {
      const errorMessage =
        requestError.response?.data?.message ||
        'Unable to analyze the message. Please try again.'

      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClear = () => {
    setMessage('')
    setSender('')
    setAnalysis(null)
    setError('')
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

  const getRiskScore = () =>
    analysis?.riskScore ??
    analysis?.score ??
    analysis?.risk?.score ??
    0

  const getRiskLevel = () =>
    analysis?.riskLevel ??
    analysis?.severity ??
    analysis?.risk?.level ??
    'unknown'

  const getExplanation = () =>
    analysis?.explanation ??
    analysis?.reason ??
    analysis?.summary ??
    'No explanation was provided.'

  const getRecommendations = () => {
    const recommendations =
      analysis?.recommendations ??
      analysis?.suggestions ??
      analysis?.safetyTips ??
      []

    if (Array.isArray(recommendations)) {
      return recommendations
    }

    if (typeof recommendations === 'string') {
      return [recommendations]
    }

    return []
  }

  const riskScore = getRiskScore()
  const riskLevel = getRiskLevel()
  const recommendations = getRecommendations()

  return (
    <div className="ai-analyzer-container">
      <div className="ai-analyzer-header">
        <div>
          <h1>AI Message Analyzer</h1>

          <p>
            Analyze suspicious messages, links, emails or
            identity-related threats using AI.
          </p>
        </div>
      </div>

      <div className="ai-analyzer-content">
        <form
          className="ai-analyzer-form"
          onSubmit={handleAnalyze}
        >
          {error && (
            <div className="ai-analyzer-error">
              <p>{error}</p>
            </div>
          )}

          <div className="ai-form-group">
            <label htmlFor="sender">
              Sender or source
            </label>

            <input
              id="sender"
              type="text"
              value={sender}
              placeholder="Phone number, email or website"
              onChange={event =>
                setSender(event.target.value)
              }
              disabled={isAnalyzing}
            />
          </div>

          <div className="ai-form-group">
            <label htmlFor="message">
              Suspicious message
              <span>*</span>
            </label>

            <textarea
              id="message"
              rows="10"
              value={message}
              placeholder="Paste the suspicious SMS, email, message or link here..."
              onChange={event => {
                setMessage(event.target.value)

                if (error) {
                  setError('')
                }
              }}
              disabled={isAnalyzing}
            />

            <p className="character-count">
              {message.length} characters
            </p>
          </div>

          <div className="ai-form-actions">
            <button
              type="button"
              className="clear-analysis-button"
              onClick={handleClear}
              disabled={isAnalyzing}
            >
              Clear
            </button>

            <button
              type="submit"
              className="analyze-message-button"
              disabled={isAnalyzing}
            >
              {isAnalyzing
                ? 'Analyzing Message...'
                : 'Analyze Message'}
            </button>
          </div>
        </form>

        <section className="analysis-result-section">
          {!analysis ? (
            <div className="analysis-placeholder">
              <h2>Analysis Result</h2>

              <p>
                Enter a suspicious message and click
                Analyze Message to view its risk score,
                explanation and safety recommendations.
              </p>
            </div>
          ) : (
            <div className="analysis-result-card">
              <div className="analysis-result-header">
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
              </div>

              <div className="analysis-detail">
                <h3>AI Explanation</h3>

                <p>{getExplanation()}</p>
              </div>

              {analysis.category && (
                <div className="analysis-detail">
                  <h3>Detected Category</h3>

                  <p>
                    {formatText(analysis.category)}
                  </p>
                </div>
              )}

              {analysis.detectedThreats &&
                Array.isArray(
                  analysis.detectedThreats,
                ) &&
                analysis.detectedThreats.length > 0 && (
                  <div className="analysis-detail">
                    <h3>Detected Threats</h3>

                    <ul>
                      {analysis.detectedThreats.map(
                        (threat, index) => (
                          <li key={`${threat}-${index}`}>
                            {formatText(threat)}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

              <div className="analysis-detail">
                <h3>Safety Recommendations</h3>

                {recommendations.length === 0 ? (
                  <p>
                    No specific recommendations were
                    provided.
                  </p>
                ) : (
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
                )}
              </div>

              {analysis.isSuspicious !== undefined && (
                <div className="analysis-detail">
                  <h3>Suspicious Message</h3>

                  <p>
                    {analysis.isSuspicious
                      ? 'Yes, this message may be suspicious.'
                      : 'No major threat was detected.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default AIAnalyzer
