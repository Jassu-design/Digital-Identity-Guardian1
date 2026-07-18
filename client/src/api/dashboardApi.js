import api from './axios'

// Get dashboard summary
export const getDashboard = async () => {
  const response = await api.get('/dashboard')
  return response.data
}