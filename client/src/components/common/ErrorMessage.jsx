import './ErrorMessage.css'

const ErrorMessage = ({
  title = 'Something went wrong',
  message = 'Please try again.',
  onRetry,
}) => (
  <div className="error-message-container">
    <div className="error-message-icon">!</div>

    <h2>{title}</h2>

    <p>{message}</p>

    {onRetry && (
      <button
        type="button"
        className="error-retry-button"
        onClick={onRetry}
      >
        Try Again
      </button>
    )}
  </div>
)

export default ErrorMessage