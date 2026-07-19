import api from './axios.js'

// Upload an image for OCR analysis
export const analyzeImage = async formData => {
  const response = await api.post(
    '/ocr/extract',
    formData,
  )

  return response.data
}
