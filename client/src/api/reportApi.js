import api from './axios.js'

// Get the logged-in user's security report
export const getSecurityReport = async () => {
  const response = await api.get('/reports')

  return response.data
}

// Generate or refresh the security report
export const generateSecurityReport = async () => {
  const response = await api.post('/reports/generate')

  return response.data
}

// Download the report as a PDF
export const downloadSecurityReport = async () => {
  const response = await api.get('/reports/download', {
    responseType: 'blob',
  })

  return response
}