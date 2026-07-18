import {Link, NavLink, useNavigate} from 'react-router-dom'
import {toast} from 'react-hot-toast'

import useAuth from '../../hooks/useAuth'
import './Navbar.css'

const Navbar = () => {
  const {user, logout} = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login', {replace: true})
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/dashboard">
          Digital Identity Guardian
        </Link>
      </div>

      <ul className="navbar-links">
        <li>
          <NavLink to="/dashboard">
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/incidents">
            Incidents
          </NavLink>
        </li>

        <li>
          <NavLink to="/ai-analyzer">
            AI Analyzer
          </NavLink>
        </li>

        <li>
          <NavLink to="/ocr">
            OCR
          </NavLink>
        </li>

        <li>
          <NavLink to="/reports">
            Reports
          </NavLink>
        </li>

        <li>
          <NavLink to="/organization">
            Organization
          </NavLink>
        </li>
      </ul>

      <div className="navbar-user">
        <div className="user-details">
          <p className="user-name">
            {user?.name}
          </p>

          <p className="user-email">
            {user?.email}
          </p>
        </div>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar