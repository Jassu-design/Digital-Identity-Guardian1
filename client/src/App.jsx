import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Incidents from './pages/Incidents/Incidents.jsx'
import CreateIncident from './pages/Incidents/CreateIncident.jsx'
import IncidentDetails from './pages/Incidents/IncidentDetails.jsx'
import AIAnalyzer from './pages/AIAnalyzer/AIAnalyzer.jsx'
import AIHistory from './pages/AIAnalyzer/AIHistory.jsx'
import AIAnalysisDetails from './pages/AIAnalyzer/AIAnalysisDetails.jsx'
import OCR from './pages/OCR/OCR.jsx'
import Reports from './pages/Reports/Reports.jsx'
import Organization from './pages/Organization/Organization.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'

import ProtectedRoute from './routes/ProtectedRoute.jsx'
import PublicRoute from './routes/PublicRoute.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Settings from './pages/Settings/Settings.jsx'

const App = () => (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/incidents"
          element={<Incidents />}
        />

        <Route
          path="/incidents/create"
          element={<CreateIncident />}
        />

        <Route
          path="/incidents/:id"
          element={<IncidentDetails />}
        />

        <Route
          path="/ai-analyzer"
          element={<AIAnalyzer />}
        />

        <Route
          path="/ai-history"
          element={<AIHistory />}
        />

        <Route
          path="/ai-history/:id"
          element={<AIAnalysisDetails />}
        />

        <Route
          path="/ocr"
          element={<OCR />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/organization"
          element={<Organization />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Route>
    </Route>

    <Route
      path="/"
      element={<Navigate to="/dashboard" replace />}
    />

    <Route
      path="*"
      element={<NotFound />}
    />
  </Routes>
)

export default App