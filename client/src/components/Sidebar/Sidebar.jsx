import {NavLink} from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
    },
    {
      name: 'Incidents',
      path: '/incidents',
    },
    {
      name: 'AI Analyzer',
      path: '/ai-analyzer',
    },
    {
      name: 'OCR Analyzer',
      path: '/ocr',
    },
    {
      name: 'Reports',
      path: '/reports',
    },
    {
      name: 'Organization',
      path: '/organization',
    },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Guardian Panel</h2>
        <p>Digital security tools</p>
      </div>

      <nav className="sidebar-navigation">
        <ul className="sidebar-menu">
          {menuItems.map(eachItem => (
            <li key={eachItem.path}>
              <NavLink
                  to="/profile"
                  className={({isActive}) =>
                    isActive
                      ? 'sidebar-link active'
                      : 'sidebar-link'
                  }
                >
                  Profile
                </NavLink>

                <NavLink
                  to="/settings"
                  className={({isActive}) =>
                    isActive
                      ? 'sidebar-link active'
                      : 'sidebar-link'
                  }
                >
                  Settings
                </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar