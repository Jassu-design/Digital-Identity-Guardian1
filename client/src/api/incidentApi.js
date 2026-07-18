import api from './axios.js'

// Create a new incident
export const createIncident = async incidentData => {
  const response = await api.post('/incidents', incidentData)

  return response.data
}

// Get all incidents of the logged-in user
export const getIncidents = async () => {
  const response = await api.get('/incidents')

  return response.data
}

// Get one incident by ID
export const getIncidentById = async incidentId => {
  const response = await api.get(`/incidents/${incidentId}`)

  return response.data
}

// Mark or update an incident as resolved
export const resolveIncident = async (
  incidentId,
  updateData = {},
) => {
  const response = await api.patch(
    `/incidents/${incidentId}/resolve`,
    updateData,
  )

  return response.data
}

// Delete an incident
export const deleteIncident = async incidentId => {
  const response = await api.delete(
    `/incidents/${incidentId}`,
  )

  return response.data
}