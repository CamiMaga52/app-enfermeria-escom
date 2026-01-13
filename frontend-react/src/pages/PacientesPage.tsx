import type React from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/authService"
import PacienteList from "../components/Pacientes/PacienteList"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import "./PacientesPage.css"

const PacientesPage: React.FC = () => {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  if (!user) {
    navigate("/login")
    return null
  }

  const isAdmin = authService.isAdmin()

  return (
    <div className="pacientes-page">
      <Header isAdmin={isAdmin} />

      <main className="pacientes-main">
        <div className="container">
          <div className="page-header mb-4">
            <h2 className="h3" style={{ color: "#ff6b35" }}>
              <i className="bi bi-people me-2"></i>
              Gestión de Pacientes
            </h2>
            <p className="text-muted">Registro y seguimiento de pacientes</p>
          </div>

          <PacienteList />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PacientesPage
