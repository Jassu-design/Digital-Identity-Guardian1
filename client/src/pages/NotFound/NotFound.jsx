import {Link} from 'react-router-dom'

import './NotFound.css'

const NotFound = () => (
  <div className="not-found-page">
    <h1>404</h1>

    <h2>Page Not Found</h2>

    <p>
      The page you are looking for does not exist or may
      have been moved.
    </p>

    <Link to="/dashboard">
      Go to Dashboard
    </Link>
  </div>
)

export default NotFound