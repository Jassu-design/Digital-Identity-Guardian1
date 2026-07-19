import {useEffect, useState} from 'react'
import {toast} from 'react-hot-toast'

import {
  createOrganization,
  getOrganization,
  updateOrganization,
} from '../../api/organizationApi.js'

import './Organization.css'

const initialFormData = {
  name: '',
  industry: '',
  email: '',
  phone: '',
  website: '',
  address: '',
}

const Organization = () => {
  const [organization, setOrganization] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')

  const fetchOrganization = async () => {
  try {
    setIsLoading(true)
    setError('')

    const response = await getOrganization()

    console.log('Organization API response:', response)

    const organizationData =
      response?.data?.organization ||
      response?.organization ||
      response?.data ||
      null

    setOrganization(organizationData)

    if (organizationData) {
      setFormData({
        name: organizationData.name || '',
        industry: organizationData.industry || '',
        email: organizationData.email || '',
        phone: organizationData.phone || '',
        website: organizationData.website || '',
        address: organizationData.address || '',
      })
    } else {
      setFormData(initialFormData)
    }
  } catch (requestError) {
    console.error(
      'Organization fetch error:',
      requestError.response?.data || requestError,
    )

    if (requestError.response?.status === 404) {
      setOrganization(null)
      setFormData(initialFormData)
      return
    }

    const message =
      requestError.response?.data?.message ||
      'Unable to load organization.'

    setError(message)
    toast.error(message)
  } finally {
    setIsLoading(false)
  }
}

  useEffect(() => {
    fetchOrganization()
  }, [])

  const handleInputChange = event => {
    const {name, value} = event.target

    setFormData(currentData => ({
      ...currentData,
      [name]: value,
    }))

    if (error) {
      setError('')
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Organization name is required.'
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      return 'Please enter a valid email address.'
    }

    return ''
  }

  const handleSubmit = async event => {
        event.preventDefault()

        const validationError = validateForm()

        if (validationError) {
          setError(validationError)
          return
        }

        try {
          setIsSubmitting(true)
          setError('')

          const organizationData = {
            name: formData.name.trim(),
            industry: formData.industry.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            website: formData.website.trim(),
            address: formData.address.trim(),
          }

          console.log(
            'Organization payload:',
            organizationData,
          )

          if (organization?._id) {
            await updateOrganization(organizationData)

            toast.success(
              'Organization updated successfully',
            )
          } else {
            await createOrganization(organizationData)

            toast.success(
              'Organization created successfully',
            )
          }

          // Fetch the actual saved data from MongoDB
          await fetchOrganization()

          setIsEditing(false)
        } catch (requestError) {
          console.error(
            'Organization save error:',
            requestError.response?.data || requestError,
          )

          const message =
            requestError.response?.data?.message ||
            'Unable to save organization.'

          setError(message)
          toast.error(message)
        } finally {
          setIsSubmitting(false)
        }
      }

  

  const handleCancelEdit = () => {
    setFormData({
      name: organization?.name || '',
      industry: organization?.industry || '',
      email: organization?.email || '',
      phone: organization?.phone || '',
      website: organization?.website || '',
      address: organization?.address || '',
    })

    setIsEditing(false)
    setError('')
  }

  if (isLoading) {
    return (
      <div className="organization-loading">
        <h2>Loading organization...</h2>
      </div>
    )
  }

  const showForm = !organization || isEditing

  return (
    <div className="organization-container">
      <div className="organization-header">
        <div>
          <h1>Organization</h1>

          <p>
            Manage your organization and its contact
            information.
          </p>
        </div>

        {organization && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
          >
            Edit Organization
          </button>
        )}
      </div>

      {showForm ? (
        <form
          className="organization-form"
          onSubmit={handleSubmit}
          noValidate
        >
          {error && (
            <div className="organization-error">
              <p>{error}</p>
            </div>
          )}

          <div className="organization-form-group">
            <label htmlFor="name">
              Organization Name
              <span>*</span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              placeholder="Enter organization name"
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="organization-form-group">
            <label htmlFor="industry">Industry</label>

            <input
              id="industry"
              name="industry"
              type="text"
              value={formData.industry}
              placeholder="Example: Information Technology"
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="organization-form-row">
            <div className="organization-form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                placeholder="organization@example.com"
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="organization-form-group">
              <label htmlFor="phone">Phone</label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                placeholder="Enter phone number"
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="organization-form-group">
            <label htmlFor="website">Website</label>

            <input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              placeholder="https://example.com"
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="organization-form-group">
            <label htmlFor="address">Address</label>

            <textarea
              id="address"
              name="address"
              rows="4"
              value={formData.address}
              placeholder="Enter organization address"
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="organization-form-actions">
            {organization && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : organization
                  ? 'Update Organization'
                  : 'Create Organization'}
            </button>
          </div>
        </form>
      ) : (
        <section className="organization-details-card">
          <div className="organization-detail">
            <strong>Organization Name</strong>
            <p>{organization.name}</p>
          </div>

          <div className="organization-detail">
            <strong>Industry</strong>
            <p>{organization.industry || 'Not provided'}</p>
          </div>

          <div className="organization-detail">
            <strong>Email</strong>
            <p>{organization.email || 'Not provided'}</p>
          </div>

          <div className="organization-detail">
            <strong>Phone</strong>
            <p>{organization.phone || 'Not provided'}</p>
          </div>

          <div className="organization-detail">
            <strong>Website</strong>

            {organization.website ? (
              <a
                href={organization.website}
                target="_blank"
                rel="noreferrer"
              >
                {organization.website}
              </a>
            ) : (
              <p>Not provided</p>
            )}
          </div>

          <div className="organization-detail">
            <strong>Address</strong>
            <p>{organization.address || 'Not provided'}</p>
          </div>

          <div className="organization-details-actions">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>

            
          </div>
        </section>
      )}
    </div>
  )
}

export default Organization