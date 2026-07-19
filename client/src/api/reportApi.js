import api from './axios.js'

// Generate and retrieve the logged-in user's security report
export const getSecurityReport = async () => {
  const response = await api.get('/reports')

  return response.data
}