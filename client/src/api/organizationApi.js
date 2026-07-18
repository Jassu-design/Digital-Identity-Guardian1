import api from './axios.js'

// Get the organization connected to the logged-in user
export const getOrganization = async () => {
  const response = await api.get('/organizations')

  return response.data
}

// Create a new organization
export const createOrganization = async organizationData => {
  const response = await api.post(
    '/organizations',
    organizationData,
  )

  return response.data
}

// Update organization details
export const updateOrganization = async (
  organizationId,
  organizationData,
) => {
  const response = await api.patch(
    `/organizations/${organizationId}`,
    organizationData,
  )

  return response.data
}

// Delete an organization
export const deleteOrganization = async organizationId => {
  const response = await api.delete(
    `/organizations/${organizationId}`,
  )

  return response.data
}