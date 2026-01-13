"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/authService"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import "./DashboardPage.css"

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  const [apiHealth, setApiHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      navigate("/login")
      return
    }

    if (authService.isAdmin()) {
      navigate("/admin")
      return
    }

    setUser(currentUser)
    loadData()
  }, [navigate])

  const loadData = async () => {
    try {
      const health = await authService.checkApiHealth()
      setApiHealth(health)
    } catch (error) {
      console.error("Error cargando datos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <Header isAdmin={false} />

      <main className="dashboard-main">
        <div className="container">
          <div className="welcome-section mb-4">
            <h2 className="h3" style={{ color: "#ff6b35" }}>
              Bienvenido, {user?.nombre || "Usuario"}
            </h2>
            <p className="text-muted">Panel de control del sistema de inventario</p>
          </div>

          {apiHealth && (
            <div className="status-card">
              <h3>Estado del Sistema</h3>
              <div className="status-grid">
                <div className="status-item">
                  <span className="status-label">Backend:</span>
                  <span className={`status-value ${apiHealth.database === "CONNECTED" ? "online" : "offline"}`}>
                    {apiHealth.database || "DESCONOCIDO"}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Total Usuarios:</span>
                  <span className="status-value">{apiHealth.totalUsuarios || 0}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Mensaje:</span>
                  <span className="status-value">{apiHealth.mensaje || "Sistema operativo"}</span>
                </div>
              </div>
            </div>
          )}

          <div className="quick-actions">
            <h3>Acciones Rápidas</h3>
            <div className="actions-grid">
              <button className="action-card" onClick={() => navigate("/medicamentos")}>
                <span className="action-icon">💊</span>
                <span className="action-title">Medicamentos</span>
                <span className="action-desc">Gestionar inventario</span>
              </button>

              <button className="action-card" onClick={() => navigate("/materiales")}>
                <span className="action-icon">🩹</span>
                <span className="action-title">Materiales</span>
                <span className="action-desc">Control de stock</span>
              </button>

              <button className="action-card" onClick={() => navigate("/pacientes")}>
                <span className="action-icon">👤</span>
                <span className="action-title">Pacientes</span>
                <span className="action-desc">Registro y seguimiento</span>
              </button>

              <button className="action-card" onClick={() => navigate("/recetas")}>
                <span className="action-icon">📝</span>
                <span className="action-title">Recetas</span>
                <span className="action-desc">Prescripción médica</span>
              </button>

              <button className="action-card" onClick={() => navigate("/reportes")}>
                <span className="action-icon">📊</span>
                <span className="action-title">Reportes</span>
                <span className="action-desc">Generar reportes PDF</span>
              </button>
            </div>
          </div>

          <div className="user-info-card">
            <h3>Información de tu Cuenta</h3>
            <div className="user-details-grid">
              <div className="user-detail">
                <span className="detail-label">Nombre:</span>
                <span className="detail-value">{user?.nombreCompleto || user?.nombre}</span>
              </div>
              <div className="user-detail">
                <span className="detail-label">Correo:</span>
                <span className="detail-value">{user?.correo}</span>
              </div>
              <div className="user-detail">
                <span className="detail-label">Rol:</span>
                <span className="detail-value role-badge">{user?.rol}</span>
              </div>
              <div className="user-detail">
                <span className="detail-label">Estado:</span>
                <span className={`detail-value ${user?.activo ? "active" : "inactive"}`}>
                  {user?.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default DashboardPage
