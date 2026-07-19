import api from './axios.js'

// Get logged-in user's organization
export const getOrganization = async () => {
  const response = await api.get('/organizations')

  return response.data
}

// Create organization
export const createOrganization = async organizationData => {
  const response = await api.post(
    '/organizations',
    organizationData,
  )

  return response.data
}

// Update organization
export const updateOrganization = async organizationData => {
  const response = await api.patch(
    '/organizations',
    organizationData,
  )

  return response.data
}