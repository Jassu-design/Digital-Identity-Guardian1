import api from './axios.js'

// Upload an image for OCR analysis
export const analyzeImage = async formData => {
  const response = await api.post('/ocr/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

// Get OCR analysis history
export const getOCRHistory = async () => {
  const response = await api.get('/ocr/history')

  return response.data
}

// Get OCR analysis by ID
export const getOCRById = async id => {
  const response = await api.get(`/ocr/history/${id}`)

  return response.data
}

// Delete OCR analysis
export const deleteOCRAnalysis = async id => {
  const response = await api.delete(`/ocr/history/${id}`)

  return response.data
}