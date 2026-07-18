import {useEffect, useState} from 'react'
import {toast} from 'react-hot-toast'

import {
  analyzeImage,
  getOCRHistory,
  deleteOCRAnalysis,
} from '../../api/ocrApi.js'

import './OCR.css'

const OCR = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] =
    useState(true)
  const [error, setError] = useState('')

  const fetchHistory = async () => {
    try {
      setIsHistoryLoading(true)

      const response = await getOCRHistory()

      const historyData =
        response.data?.history ||
        response.data ||
        response.history ||
        []

      setHistory(
        Array.isArray(historyData) ? historyData : [],
      )
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          'Unable to load OCR history.',
      )
    } finally {
      setIsHistoryLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleImageChange = event => {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        'Please select a PNG, JPG, JPEG or WebP image.',
      )
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5 MB.')
      return
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    setSelectedImage(file)
    setImagePreview(URL.createObjectURL(file))
    setResult(null)
    setError('')
  }

  const handleAnalyze = async event => {
    event.preventDefault()

    if (!selectedImage) {
      setError('Please select an image first.')
      return
    }

    try {
      setIsAnalyzing(true)
      setError('')
      setResult(null)

      const formData = new FormData()

      // Change "image" only if your backend uses another field name.
      formData.append('image', selectedImage)

      const response = await analyzeImage(formData)

      const analysisResult =
        response.data?.analysis ||
        response.data ||
        response.analysis ||
        response

      setResult(analysisResult)

      toast.success('Image analyzed successfully')
      fetchHistory()
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        'Unable to analyze the image.'

      setError(message)
      toast.error(message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDeleteHistory = async id => {
    const confirmed = window.confirm(
      'Delete this OCR analysis?',
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteOCRAnalysis(id)

      setHistory(currentHistory =>
        currentHistory.filter(item => item._id !== id),
      )

      toast.success('OCR analysis deleted')
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          'Unable to delete OCR analysis.',
      )
    }
  }

  const handleReset = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    setSelectedImage(null)
    setImagePreview('')
    setResult(null)
    setError('')
  }

  const formatText = value => {
    if (!value) {
      return 'Unknown'
    }

    return String(value)
      .replaceAll('_', ' ')
      .replace(/\b\w/g, character =>
        character.toUpperCase(),
      )
  }

  const extractedText =
    result?.extractedText ||
    result?.text ||
    result?.ocrText ||
    'No text was extracted.'

  const riskScore =
    result?.riskScore ||
    result?.analysis?.riskScore ||
    0

  const riskLevel =
    result?.riskLevel ||
    result?.severity ||
    result?.analysis?.riskLevel ||
    'unknown'

  const recommendations =
    result?.recommendations ||
    result?.analysis?.recommendations ||
    []

  return (
    <div className="ocr-container">
      <div className="ocr-header">
        <h1>OCR Screenshot Analyzer</h1>

        <p>
          Upload a screenshot to extract its text and check
          it for digital identity threats.
        </p>
      </div>

      <div className="ocr-content">
        <form
          className="ocr-upload-section"
          onSubmit={handleAnalyze}
        >
          {error && (
            <div className="ocr-error">
              <p>{error}</p>
            </div>
          )}

          <div className="ocr-file-input">
            <label htmlFor="ocr-image">
              Select screenshot
            </label>

            <input
              id="ocr-image"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
              disabled={isAnalyzing}
            />
          </div>

          {imagePreview && (
            <div className="ocr-image-preview">
              <img
                src={imagePreview}
                alt="Selected screenshot preview"
              />

              <p>{selectedImage?.name}</p>
            </div>
          )}

          <div className="ocr-actions">
            <button
              type="button"
              onClick={handleReset}
              disabled={isAnalyzing}
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={!selectedImage || isAnalyzing}
            >
              {isAnalyzing
                ? 'Analyzing Image...'
                : 'Extract and Analyze'}
            </button>
          </div>
        </form>

        <section className="ocr-result-section">
          {!result ? (
            <div className="ocr-result-placeholder">
              <h2>Analysis Result</h2>

              <p>
                Upload a screenshot to view extracted text,
                risk score and safety recommendations.
              </p>
            </div>
          ) : (
            <div className="ocr-result-card">
              <div className="ocr-risk-summary">
                <div>
                  <p>Risk Score</p>
                  <h2>{riskScore}/100</h2>
                </div>

                <span
                  className={`ocr-risk-level risk-${String(
                    riskLevel,
                  ).toLowerCase()}`}
                >
                  {formatText(riskLevel)} Risk
                </span>
              </div>

              <div className="ocr-result-detail">
                <h3>Extracted Text</h3>
                <p>{extractedText}</p>
              </div>

              {result?.explanation && (
                <div className="ocr-result-detail">
                  <h3>Explanation</h3>
                  <p>{result.explanation}</p>
                </div>
              )}

              <div className="ocr-result-detail">
                <h3>Recommendations</h3>

                {Array.isArray(recommendations) &&
                recommendations.length > 0 ? (
                  <ul>
                    {recommendations.map(
                      (recommendation, index) => (
                        <li
                          key={`${recommendation}-${index}`}
                        >
                          {recommendation}
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <p>No recommendations provided.</p>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="ocr-history-section">
        <h2>OCR History</h2>

        {isHistoryLoading ? (
          <p>Loading history...</p>
        ) : history.length === 0 ? (
          <p>No OCR analyses found.</p>
        ) : (
          <div className="ocr-history-list">
            {history.map(item => (
              <article
                className="ocr-history-card"
                key={item._id}
              >
                <div>
                  <h3>
                    {item.fileName ||
                      item.imageName ||
                      'Screenshot Analysis'}
                  </h3>

                  <p>
                    {item.extractedText ||
                      item.text ||
                      'No extracted text'}
                  </p>

                  <span>
                    Risk: {item.riskScore ?? 0}/100
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteHistory(item._id)
                  }
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default OCR