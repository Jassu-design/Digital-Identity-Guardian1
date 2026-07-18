import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {toast} from 'react-hot-toast'

import {
  deleteIncident,
  getIncidentById,
  resolveIncident,
} from '../../api/incidentApi'

import './IncidentDetails.css'

const IncidentDetails = () => {
  const {id} = useParams()
  const navigate = useNavigate()

  const [incident, setIncident] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchIncident = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await getIncidentById(id)

      setIncident(response.data)
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Unable to load incident.'

      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchIncident()
  }, [id])

  const handleResolve = async () => {
    try {
      await resolveIncident(id)

      toast.success('Incident resolved')

      fetchIncident()
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Unable to resolve incident.',
      )
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this incident?',
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteIncident(id)

      toast.success('Incident deleted')

      navigate('/incidents')
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Unable to delete incident.',
      )
    }
  }

  if (isLoading) {
    return (
      <div className="incident-details-loading">
        <h2>Loading...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="incident-details-error">
        <h2>{error}</h2>

        <button
          type="button"
          onClick={fetchIncident}
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="incident-details-error">
        <h2>Incident not found.</h2>
      </div>
    )
  }

  const formatText = value => {
    if (!value) {
      return 'N/A'
    }

    return value
      .replaceAll('_', ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
  }

  return (
    <div className="incident-details-container">
      <div className="incident-details-header">
        <div>
          <h1>{incident.title}</h1>

          <p>
            View complete information about this reported
            incident.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/incidents')}
        >
          Back
        </button>
      </div>

      <div className="incident-details-card">
        <div className="detail-item">
          <strong>Sender</strong>
          <p>{incident.sender || 'Unknown'}</p>
        </div>

        <div className="detail-item">
          <strong>Category</strong>
          <p>{formatText(incident.category)}</p>
        </div>

        <div className="detail-item">
          <strong>Severity</strong>
          <p>{formatText(incident.severity)}</p>
        </div>

        <div className="detail-item">
          <strong>Status</strong>
          <p>{formatText(incident.status)}</p>
        </div>

        <div className="detail-item">
          <strong>Risk Score</strong>
          <p>{incident.riskScore ?? 0}</p>
        </div>

        <div className="detail-item">
          <strong>Source</strong>
          <p>{formatText(incident.source)}</p>
        </div>

        <div className="detail-item full-width">
          <strong>Description</strong>

          <p>{incident.message}</p>
        </div>

        <div className="detail-item">
          <strong>Created On</strong>

          <p>
            {new Date(
              incident.createdAt,
            ).toLocaleString()}
          </p>
        </div>

        <div className="detail-item">
          <strong>Last Updated</strong>

          <p>
            {new Date(
              incident.updatedAt,
            ).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="incident-details-actions">
        {incident.status !== 'resolved' && (
          <button
            type="button"
            onClick={handleResolve}
          >
            Mark as Resolved
          </button>
        )}

        <button
          type="button"
          onClick={handleDelete}
        >
          Delete Incident
        </button>
      </div>
    </div>
  )
}

export default IncidentDetails