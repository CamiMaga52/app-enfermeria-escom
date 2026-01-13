import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login/Login"
import { authService } from "./services/authService"
import LandingPage from "./pages/LandingPage"
import DashboardPage from "./pages/DashboardPage"
import MedicamentosPage from "./pages/MedicamentosPage"
import MaterialesPage from "./pages/MaterialesPage"
import PacientesPage from "./pages/PacientesPage"
import RecetasPage from "./pages/RecetasPage"
import ReportesPage from "./pages/ReportesPage"
import AdminPage from "./pages/AdminPage"
import "./App.css"

// Componente para rutas protegidas
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return authService.isAuthenticated() ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública - Página de inicio */}
        <Route path="/" element={<LandingPage />} />

        {/* Ruta de login */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/medicamentos"
          element={
            <PrivateRoute>
              <MedicamentosPage />
            </PrivateRoute>
          }
        />

        {/* Redirecciones por defecto */}
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/inicio" element={<Navigate to="/" />} />

        {/* Ruta 404 - Redirige al login si no autenticado, al dashboard si autenticado */}
        <Route
          path="*"
          element={authService.isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        <Route
          path="/materiales"
          element={
            <PrivateRoute>
              <MaterialesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/pacientes"
          element={
            <PrivateRoute>
              <PacientesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/recetas"
          element={
            <PrivateRoute>
              <RecetasPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <PrivateRoute>
              <ReportesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
