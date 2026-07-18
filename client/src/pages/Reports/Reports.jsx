import {useEffect, useState} from 'react'
import {toast} from 'react-hot-toast'

import {
  downloadSecurityReport,
  generateSecurityReport,
  getSecurityReport,
} from '../../api/reportApi.js'

import './Reports.css'

const Reports = () => {
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] =
    useState(false)
  const [isDownloading, setIsDownloading] =
    useState(false)
  const [error, setError] = useState('')

  const fetchReport = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await getSecurityReport()

      setReport(
        response.data?.report ||
          response.data ||
          response.report ||
          response,
      )
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        'Unable to load security report.'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true)
      setError('')

      const response = await generateSecurityReport()

      const generatedReport =
        response.data?.report ||
        response.data ||
        response.report ||
        response

      setReport(generatedReport)

      toast.success('Security report generated')
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          'Unable to generate report.',
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true)

      const response = await downloadSecurityReport()

      const fileBlob = new Blob([response.data], {
        type:
          response.headers['content-type'] ||
          'application/pdf',
      })

      const downloadUrl = URL.createObjectURL(fileBlob)
      const link = document.createElement('a')

      link.href = downloadUrl
      link.download = 'digital-identity-report.pdf'

      document.body.appendChild(link)
      link.click()
      link.remove()

      URL.revokeObjectURL(downloadUrl)

      toast.success('Report downloaded')
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          'Unable to download report.',
      )
    } finally {
      setIsDownloading(false)
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
      <div className="reports-loading">
        <h2>Loading security report...</h2>
      </div>
    )
  }

  if (error && !report) {
    return (
      <div className="reports-error">
        <h2>Unable to load report</h2>
        <p>{error}</p>

        <button type="button" onClick={fetchReport}>
          Try Again
        </button>
      </div>
    )
  }

  const summary = report?.summary || report || {}
  const categoryBreakdown =
    report?.categoryBreakdown || []
  const recommendations =
    report?.recommendations || []

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div>
          <h1>Security Report</h1>

          <p>
            Review your digital identity risk and incident
            summary.
          </p>
        </div>

        <div className="report-header-actions">
          <button
            type="button"
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating
              ? 'Generating...'
              : 'Generate Report'}
          </button>

          <button
            type="button"
            onClick={handleDownloadReport}
            disabled={isDownloading || !report}
          >
            {isDownloading
              ? 'Downloading...'
              : 'Download PDF'}
          </button>
        </div>
      </div>

      <section className="report-summary-grid">
        <article className="report-summary-card">
          <p>Overall Risk Score</p>
          <h2>{summary.riskScore ?? 0}/100</h2>
        </article>

        <article className="report-summary-card">
          <p>Risk Level</p>
          <h2>
            {formatText(
              summary.riskLevel || 'low',
            )}
          </h2>
        </article>

        <article className="report-summary-card">
          <p>Total Incidents</p>
          <h2>{summary.totalIncidents ?? 0}</h2>
        </article>

        <article className="report-summary-card">
          <p>Resolved Incidents</p>
          <h2>{summary.resolvedIncidents ?? 0}</h2>
        </article>

        <article className="report-summary-card">
          <p>Active Incidents</p>
          <h2>{summary.activeIncidents ?? 0}</h2>
        </article>

        <article className="report-summary-card">
          <p>Critical Incidents</p>
          <h2>{summary.criticalIncidents ?? 0}</h2>
        </article>
      </section>

      <section className="report-section">
        <h2>Category Breakdown</h2>

        {categoryBreakdown.length === 0 ? (
          <p>No category information available.</p>
        ) : (
          <div className="category-report-list">
            {categoryBreakdown.map(
              (category, index) => (
                <article
                  className="category-report-item"
                  key={
                    category.category ||
                    category.name ||
                    index
                  }
                >
                  <p>
                    {formatText(
                      category.category ||
                        category.name,
                    )}
                  </p>

                  <strong>
                    {category.count ?? 0}
                  </strong>
                </article>
              ),
            )}
          </div>
        )}
      </section>

      <section className="report-section">
        <h2>Security Recommendations</h2>

        {recommendations.length === 0 ? (
          <p>No recommendations available.</p>
        ) : (
          <ul className="report-recommendations">
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
      </section>

      {report?.generatedAt && (
        <p className="report-generated-date">
          Last generated:{' '}
          {new Date(
            report.generatedAt,
          ).toLocaleString('en-IN')}
        </p>
      )}
    </div>
  )
}

export default Reports