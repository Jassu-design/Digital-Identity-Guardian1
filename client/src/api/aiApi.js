import api from './axios.js'

// Analyze suspicious text using AI
export const analyzeText = async textData => {
  const response = await api.post('/ai/analyze', textData)

  return response.data
}

// Get previously saved AI analyses
export const getAnalysisHistory = async () => {
  const response = await api.get('/ai/history')

  return response.data
}

// Get one AI analysis by ID
export const getAnalysisById = async analysisId => {
  const response = await api.get(
    `/ai/history/${analysisId}`,
  )

  return response.data
}

// Delete an AI analysis
export const deleteAnalysis = async analysisId => {
  const response = await api.delete(
    `/ai/history/${analysisId}`,
  )

  return response.data
}