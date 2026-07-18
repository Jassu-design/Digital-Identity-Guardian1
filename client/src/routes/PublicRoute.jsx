import {Navigate, Outlet} from 'react-router-dom'

import useAuth from '../hooks/useAuth.js'

const PublicRoute = () => {
  const {isAuthenticated, isLoading} = useAuth()

  if (isLoading) {
    return (
      <div className="route-loader">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default PublicRoute