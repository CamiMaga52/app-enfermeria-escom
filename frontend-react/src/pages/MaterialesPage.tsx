"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/authService"
import MaterialList from "../components/Materiales/MaterialList"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import "./MaterialesPage.css"

const MaterialesPage: React.FC = () => {
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
    <div className="materiales-page">
      <Header isAdmin={false} />

      <main className="materiales-main">
        <div className="container">
          <div className="page-header mb-4">
            <h2 className="h3" style={{ color: "#ff6b35" }}>
              <i className="bi bi-bandaid me-2"></i>
              Gestión de Materiales Médicos
            </h2>
            <p className="text-muted">Administra el inventario de materiales</p>
          </div>

          <MaterialList />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default MaterialesPage
