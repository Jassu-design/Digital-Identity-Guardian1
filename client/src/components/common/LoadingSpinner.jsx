import './LoadingSpinner.css'

const LoadingSpinner = ({
  message = 'Loading...',
  fullPage = false,
}) => (
  <div
    className={
      fullPage
        ? 'loading-spinner-container full-page-loader'
        : 'loading-spinner-container'
    }
  >
    <div
      className="loading-spinner"
      role="status"
      aria-label={message}
    />

    <p>{message}</p>
  </div>
)

export default LoadingSpinner