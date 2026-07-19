import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {toast} from 'react-hot-toast'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import ErrorMessage from '../../components/common/ErrorMessage.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

import {
  deleteIncident,
  getIncidents,
  resolveIncident,
} from '../../api/incidentApi.js'

import './Incidents.css'

const Incidents = () => {
  const [incidents, setIncidents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchIncidents = async () => {
  try {
    setIsLoading(true)
    setError('')

    const response = await getIncidents()

    console.log('Incidents API response:', response)

    const incidentsData =
      response.data?.incidents ||
      response.incidents ||
      response.data ||
      []

    setIncidents(
      Array.isArray(incidentsData)
        ? incidentsData
        : [],
    )
  } catch (err) {
    console.error(
      'Incident fetching error:',
      err.response?.data || err,
    )

    const message =
      err.response?.data?.message ||
      'Unable to load incidents.'

    setError(message)
    toast.error(message)
  } finally {
    setIsLoading(false)
  }
}

  useEffect(() => {
    fetchIncidents()
  }, [])

  const handleResolve = async id => {
    try {
      await resolveIncident(id)

      toast.success('Incident resolved')

      fetchIncidents()
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Unable to resolve incident.',
      )
    }
  }

  const handleDelete = async id => {
    const confirmed = window.confirm(
      'Delete this incident?',
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteIncident(id)

      toast.success('Incident deleted')

      fetchIncidents()
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Unable to delete incident.',
      )
    }
  }

  if (isLoading) {
    return (
      <LoadingSpinner message="Loading incidents..." />
    )
  }

  if (error) {
    return (
      <ErrorMessage
      title="Unable to load incidents"
      message={error}
      onRetry={fetchIncidents}
    />
    )
  }

  return (
    <div className="incidents-container">
      <div className="incidents-header">
        <div>
          <h1>My Incidents</h1>

          <p>
            Manage all reported digital identity incidents.
          </p>
        </div>

        <Link
          to="/incidents/create"
          className="create-incident-btn"
        >
          + Report Incident
        </Link>
      </div>

      {!Array.isArray(incidents) ||
        incidents.length === 0 ? (
        <EmptyState
            title="No incidents found"
            message="Start by reporting your first security incident."
            actionText="Report Incident"
            actionPath="/incidents/create"
        />
          ) : (
        <div className="incident-list">
          {incidents.map(each => (
            <div
              className="incident-card"
              key={each._id}
            >
              <div className="incident-info">
                <h3>{each.title}</h3>

                <p>
                  <strong>Sender:</strong>{' '}
                  {each.sender || 'Unknown'}
                </p>

                <p>
                  <strong>Category:</strong>{' '}
                  {each.category}
                </p>

                <p>
                  <strong>Severity:</strong>{' '}
                  {each.severity}
                </p>

                <p>
                  <strong>Status:</strong>{' '}
                  {each.status}
                </p>

                <p>
                  <strong>Risk Score:</strong>{' '}
                  {each.riskScore}
                </p>
              </div>

              <div className="incident-actions">
                <Link
                  to={`/incidents/${each._id}`}
                >
                  View
                </Link>

                {each.status !== 'resolved' && (
                  <button
                    onClick={() =>
                      handleResolve(each._id)
                    }
                  >
                    Resolve
                  </button>
                )}

                <button
                  onClick={() =>
                    handleDelete(each._id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Incidents