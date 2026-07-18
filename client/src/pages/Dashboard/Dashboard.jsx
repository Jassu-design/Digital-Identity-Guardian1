import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {toast} from 'react-hot-toast'

import {getDashboard} from '../../api/dashboardApi.js'
import './Dashboard.css'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await getDashboard()

      setDashboardData(response.data)
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        'Unable to load dashboard data.'

      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner" />
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>

        <button
          type="button"
          onClick={fetchDashboardData}
        >
          Try Again
        </button>
      </div>
    )
  }

  const risk = dashboardData?.risk || {}
  const incidents = dashboardData?.incidents || {}
  const recentIncidents =
    dashboardData?.recentIncidents || []

  const formatText = value => {
    if (!value) {
      return 'Unknown'
    }

    return value
      .replaceAll('_', ' ')
      .replace(/\b\w/g, character =>
        character.toUpperCase(),
      )
  }

  const formatDate = dateValue => {
    if (!dateValue) {
      return 'No date'
    }

    return new Date(dateValue).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-title-section">
        <div>
          <h1>Security Dashboard</h1>

          <p>
            Monitor your digital identity risks and recent
            security incidents.
          </p>
        </div>

        <button
          type="button"
          className="refresh-dashboard-button"
          onClick={fetchDashboardData}
        >
          Refresh
        </button>
      </div>

      <section className="dashboard-summary-grid">
        <article className="summary-card risk-score-card">
          <p className="summary-label">Risk Score</p>

          <h2>{risk.riskScore ?? 0}/100</h2>

          <span
            className={`risk-level risk-${risk.riskLevel || 'low'}`}
          >
            {formatText(risk.riskLevel || 'low')} Risk
          </span>
        </article>

        <article className="summary-card">
          <p className="summary-label">
            Total Incidents
          </p>

          <h2>{incidents.total ?? 0}</h2>

          <p className="summary-description">
            All recorded security incidents
          </p>
        </article>

        <article className="summary-card">
          <p className="summary-label">
            Active Incidents
          </p>

          <h2>{incidents.active ?? 0}</h2>

          <p className="summary-description">
            Open and investigating incidents
          </p>
        </article>

        <article className="summary-card">
          <p className="summary-label">
            Resolved Incidents
          </p>

          <h2>{incidents.resolved ?? 0}</h2>

          <p className="summary-description">
            Successfully handled incidents
          </p>
        </article>
      </section>

      <section className="incident-status-section">
        <div className="section-heading">
          <h2>Incident Overview</h2>

          <Link to="/incidents">
            View All Incidents
          </Link>
        </div>

        <div className="incident-status-grid">
          <article className="status-card">
            <p>Open</p>
            <h3>{incidents.open ?? 0}</h3>
          </article>

          <article className="status-card">
            <p>Investigating</p>
            <h3>{incidents.investigating ?? 0}</h3>
          </article>

          <article className="status-card">
            <p>Critical</p>
            <h3>{incidents.critical ?? 0}</h3>
          </article>

          <article className="status-card">
            <p>High Severity</p>
            <h3>{incidents.high ?? 0}</h3>
          </article>

          <article className="status-card">
            <p>False Positive</p>
            <h3>{incidents.falsePositive ?? 0}</h3>
          </article>
        </div>
      </section>

      <section className="quick-actions-section">
        <div className="section-heading">
          <h2>Quick Actions</h2>
        </div>

        <div className="quick-actions-grid">
          <Link
            to="/incidents"
            className="quick-action-card"
          >
            <h3>Report Incident</h3>
            <p>
              Add a new digital identity security incident.
            </p>
          </Link>

          <Link
            to="/ai-analyzer"
            className="quick-action-card"
          >
            <h3>Analyze Message</h3>
            <p>
              Check suspicious messages using AI analysis.
            </p>
          </Link>

          <Link
            to="/ocr"
            className="quick-action-card"
          >
            <h3>Scan Screenshot</h3>
            <p>
              Extract and analyze text from an image.
            </p>
          </Link>

          <Link
            to="/reports"
            className="quick-action-card"
          >
            <h3>View Security Report</h3>
            <p>
              Review your complete security summary.
            </p>
          </Link>
        </div>
      </section>

      <section className="recent-incidents-section">
        <div className="section-heading">
          <h2>Recent Incidents</h2>

          <Link to="/incidents">
            View All
          </Link>
        </div>

        {recentIncidents.length === 0 ? (
          <div className="empty-incidents">
            <h3>No incidents recorded</h3>

            <p>
              Your recently reported incidents will appear
              here.
            </p>

            <Link to="/incidents">
              Report Your First Incident
            </Link>
          </div>
        ) : (
          <div className="recent-incidents-list">
            {recentIncidents.map(incident => (
              <article
                className="recent-incident-card"
                key={incident._id}
              >
                <div className="incident-main-details">
                  <h3>{incident.title}</h3>

                  <p>
                    Sender:{' '}
                    {incident.sender || 'Not provided'}
                  </p>

                  <span>
                    {formatDate(incident.createdAt)}
                  </span>
                </div>

                <div className="incident-badges">
                  <span
                    className={`severity-badge severity-${incident.severity}`}
                  >
                    {formatText(incident.severity)}
                  </span>

                  <span
                    className={`status-badge status-${incident.status}`}
                  >
                    {formatText(incident.status)}
                  </span>

                  <span className="incident-risk-score">
                    Risk: {incident.riskScore ?? 0}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard