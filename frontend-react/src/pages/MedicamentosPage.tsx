import type React from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/authService"
import MedicamentosList from "../components/Medicamentos/MedicamentosList"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import "./MedicamentosPage.css"

const MedicamentosPage: React.FC = () => {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  if (!user) {
    navigate("/login")
    return null
  }

  if (authService.isAdmin()) {
    navigate("/admin")
    return null
  }

  return (
    <div className="medicamentos-page">
      <Header isAdmin={false} />

      <main className="medicamentos-main">
        <div className="container">
          <div className="page-header mb-4">
            <h2 className="h3" style={{ color: "#ff6b35" }}>
              <i className="bi bi-capsule me-2"></i>
              Gestión de Medicamentos
            </h2>
            <p className="text-muted">Administra el inventario de medicamentos</p>
          </div>

          <MedicamentosList />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default MedicamentosPage
