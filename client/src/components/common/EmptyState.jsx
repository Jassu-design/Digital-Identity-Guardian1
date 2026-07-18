import {Link} from 'react-router-dom'

import './EmptyState.css'

const EmptyState = ({
  title = 'No data found',
  message = 'There is currently nothing to display.',
  actionText,
  actionPath,
  onAction,
}) => (
  <div className="empty-state-container">
    <div className="empty-state-icon">○</div>

    <h2>{title}</h2>

    <p>{message}</p>

    {actionText && actionPath && (
      <Link
        to={actionPath}
        className="empty-state-action"
      >
        {actionText}
      </Link>
    )}

    {actionText && onAction && !actionPath && (
      <button
        type="button"
        className="empty-state-action"
        onClick={onAction}
      >
        {actionText}
      </button>
    )}
  </div>
)

export default EmptyState