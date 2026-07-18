import {createWorker} from 'tesseract.js'

const allowedLanguages = ['eng']

const validateLanguage = language =>
  allowedLanguages.includes(language) ? language : 'eng'

export const extractTextFromImage = async (
  imagePath,
  language = 'eng',
) => {
  if (!imagePath) {
    throw new Error('Image path is required for OCR processing.')
  }

  const selectedLanguage = validateLanguage(language)

  let worker

  try {
    worker = await createWorker(selectedLanguage)

    const result = await worker.recognize(imagePath)

    const extractedText = result.data.text?.trim() || ''
    const confidence = Math.round(result.data.confidence || 0)

    if (!extractedText) {
      throw new Error(
        'No readable text was detected in the uploaded image.',
      )
    }

    return {
      text: extractedText,
      confidence,
      language: selectedLanguage,
      wordCount: extractedText
        .split(/\s+/)
        .filter(Boolean).length,
      characterCount: extractedText.length,
    }
  } catch (error) {
    console.error('OCR processing error:', error.message)

    throw new Error(
      error.message ||
        'Failed to extract text from the uploaded image.',
    )
  } finally {
    if (worker) {
      await worker.terminate()
    }
  }
}