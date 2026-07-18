import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {toast} from 'react-hot-toast'

import {createIncident} from '../../api/incidentApi.js'
import './CreateIncident.css'

const CreateIncident = () => {
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm({
    defaultValues: {
      title: '',
      message: '',
      sender: '',
      category: 'other',
      severity: 'low',
      source: 'manual',
    },
  })

  const onSubmit = async formData => {
    try {
      setServerError('')

      const incidentData = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        sender: formData.sender.trim() || 'Unknown',
        category: formData.category,
        severity: formData.severity,
        source: formData.source,
      }

      const response = await createIncident(incidentData)
      const createdIncident = response.data?.incident

      toast.success('Incident reported successfully')
      reset()

      if (createdIncident?._id) {
        navigate(`/incidents/${createdIncident._id}`)
      } else {
        navigate('/incidents')
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Unable to report incident. Please try again.'

      setServerError(message)
      toast.error(message)
    }
  }

  const handleCancel = () => {
    navigate('/incidents')
  }

  return (
    <div className="create-incident-container">
      <div className="create-incident-header">
        <div>
          <h1>Report an Incident</h1>

          <p>
            Add details about a suspicious message or digital
            identity threat.
          </p>
        </div>

        <button
          type="button"
          className="cancel-incident-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>

      <form
        className="create-incident-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {serverError && (
          <div className="incident-form-error">
            <p>{serverError}</p>
          </div>
        )}

        <div className="incident-form-group">
          <label htmlFor="title">
            Incident title
            <span>*</span>
          </label>

          <input
            id="title"
            type="text"
            placeholder="Example: Suspicious bank OTP message"
            className={errors.title ? 'input-error' : ''}
            {...register('title', {
              required: 'Incident title is required',
              minLength: {
                value: 3,
                message:
                  'Title must contain at least 3 characters',
              },
              maxLength: {
                value: 100,
                message:
                  'Title cannot exceed 100 characters',
              },
            })}
          />

          {errors.title && (
            <p className="field-error-message">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="incident-form-group">
          <label htmlFor="message">
            Suspicious message or description
            <span>*</span>
          </label>

          <textarea
            id="message"
            rows="7"
            placeholder="Paste the suspicious message or explain what happened..."
            className={errors.message ? 'input-error' : ''}
            {...register('message', {
              required:
                'Message or incident description is required',
              minLength: {
                value: 3,
                message:
                  'Message must contain at least 3 characters',
              },
              maxLength: {
                value: 5000,
                message:
                  'Message cannot exceed 5000 characters',
              },
            })}
          />

          {errors.message && (
            <p className="field-error-message">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="incident-form-group">
          <label htmlFor="sender">Sender</label>

          <input
            id="sender"
            type="text"
            placeholder="Phone number, email, website or name"
            className={errors.sender ? 'input-error' : ''}
            {...register('sender', {
              maxLength: {
                value: 100,
                message:
                  'Sender cannot exceed 100 characters',
              },
            })}
          />

          {errors.sender && (
            <p className="field-error-message">
              {errors.sender.message}
            </p>
          )}
        </div>

        <div className="incident-form-row">
          <div className="incident-form-group">
            <label htmlFor="category">Category</label>

            <select
              id="category"
              {...register('category', {
                required: 'Category is required',
              })}
            >
              <option value="otp">OTP</option>
              <option value="banking">Banking</option>
              <option value="phishing">Phishing</option>
              <option value="delivery">Delivery</option>
              <option value="government">Government</option>
              <option value="healthcare">Healthcare</option>
              <option value="social_media">
                Social Media
              </option>
              <option value="promotional">
                Promotional
              </option>
              <option value="recycled_number">
                Recycled Number
              </option>
              <option value="identity_theft">
                Identity Theft
              </option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="incident-form-group">
            <label htmlFor="severity">Severity</label>

            <select
              id="severity"
              {...register('severity', {
                required: 'Severity is required',
              })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="incident-form-group">
          <label htmlFor="source">Incident source</label>

          <select
            id="source"
            {...register('source', {
              required: 'Incident source is required',
            })}
          >
            <option value="manual">Manual Entry</option>
            <option value="sms">SMS</option>
            <option value="screenshot">Screenshot</option>
            <option value="email">Email</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="incident-form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="submit-incident-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Reporting Incident...'
              : 'Report Incident'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateIncident