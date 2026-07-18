import {
  Link,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'

import ProtectedRoute from './routes/ProtectedRoute.jsx'
import PublicRoute from './routes/PublicRoute.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import Incidents from './pages/Incidents/Incidents'
import CreateIncident from './pages/Incidents/CreateIncident.jsx'

const NotFound = () => (
  <div className="not-found-page">
    <h1>404</h1>
    <h2>Page not found</h2>

    <p>The page you are looking for does not exist.</p>

    <Link to="/dashboard">Go to Dashboard</Link>
  </div>
)

const App = () => (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Route>

    <Route
      path="/"
      element={<Navigate to="/dashboard" replace />}
    />

    <Route
    path="/incidents"
    element={<Incidents />}
    />
    
    <Route
    path="/incidents/create"
    element={<CreateIncident />}
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default App