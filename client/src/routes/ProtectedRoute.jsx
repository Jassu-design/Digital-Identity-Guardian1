import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import useAuth from '../hooks/useAuth.js'

const ProtectedRoute = () => {
  const {isAuthenticated, isLoading} = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="route-loader">
        <div className="loading-spinner" />
        <p>Checking authentication...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{from: location}}
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute