"use client"

import type React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { authService } from "../../services/authService"

interface HeaderProps {
  isAdmin?: boolean
}

const Header: React.FC<HeaderProps> = ({ isAdmin = false }) => {
  const user = authService.getCurrentUser()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    authService.logout()
    navigate("/")
  }

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : ""
  }

  if (!user) return null

  return (
    <header className="text-white p-3 mb-4" style={{ background: "linear-gradient(135deg, #ff6b35 0%, #ff9f1c 100%)" }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Link to={isAdmin ? "/admin" : "/dashboard"} className="text-white text-decoration-none h4 mb-0 me-4">
              <i className="bi bi-hospital me-2"></i>
              SIGIE 
            </Link>

            <nav className="d-none d-md-flex align-items-center">
              {isAdmin ? (
                // Navegación para Administradores
                <>
                  <Link
                    to="/admin"
                    className={`text-white text-decoration-none me-3 ${isActive("/admin") ? "fw-bold" : ""}`}
                  >
                    <i className="bi bi-shield-lock me-1"></i>
                    Admin
                  </Link>
                  <Link
                    to="/pacientes"
                    className={`text-white text-decoration-none me-3 ${isActive("/pacientes") ? "fw-bold" : ""}`}
                  >
                    <i className="bi bi-people me-1"></i>
                    Pacientes
                  </Link>
                </>
              ) : (
                // Navegación para Usuarios normales (médicos, enfermeros, etc.)
                <>
                  <Link
                    to="/dashboard"
                    className={`text-white text-decoration-none me-3 ${isActive("/dashboard") ? "fw-bold" : ""}`}
                  >
                    <i className="bi bi-speedometer2 me-1"></i>
                    Dashboard
                  </Link>

                  <Link
                    to="/medicamentos"
                    className={`text-white text-decoration-none me-3 ${isActive("/medicamentos") ? "fw-bold" : ""}`}
                  >
                    <i className="bi bi-capsule me-1"></i>
                    Medicamentos
                  </Link>

                  <Link
                    to="/materiales"
                    className={`text-white text-decoration-none me-3 ${isActive("/materiales") ? "fw-bold" : ""}`}
                  >
                    <i className="bi bi-bandaid me-1"></i>
                    Materiales
                  </Link>

                  <Link
                    to="/recetas"
                    className={`text-white text-decoration-none me-3 ${isActive("/recetas") ? "fw-bold" : ""}`}
                  >
                    <i className="bi bi-prescription me-1"></i>
                    Recetas
                  </Link>

                  <Link
                    to="/pacientes"
                    className={`text-white text-decoration-none me-3 ${isActive("/pacientes") ? "fw-bold" : ""}`}
                  >
                    <i className="bi bi-people me-1"></i>
                    Pacientes
                  </Link>

                  <Link
                    to="/reportes"
                    className={`text-white text-decoration-none me-3 ${isActive("/reportes") ? "fw-bold" : ""}`}
                  >
                    <i className="bi bi-file-earmark-pdf me-1"></i>
                    Reportes
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Usuario y Cerrar Sesión */}
          <div className="d-flex align-items-center">
            {user ? (
              <div className="d-flex align-items-center">
                <div className="dropdown">
                  <button
                    className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    <span>
                      {user.nombre}
                      <small className="d-block text-muted">{user.rol}</small>
                    </span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-light">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>

        {/* Navegación móvil */}
        <div className="d-md-none mt-3">
          <div className="d-flex flex-wrap gap-2">
            {isAdmin ? (
              // Navegación móvil para Administradores
              <>
                <Link to="/admin" className={`btn btn-sm ${isActive("/admin") ? "btn-light" : "btn-outline-light"}`}>
                  <i className="bi bi-shield-lock me-1"></i>
                  Admin
                </Link>
                <Link
                  to="/pacientes"
                  className={`btn btn-sm ${isActive("/pacientes") ? "btn-light" : "btn-outline-light"}`}
                >
                  <i className="bi bi-people me-1"></i>
                  Pacientes
                </Link>
              </>
            ) : (
              // Navegación móvil para Usuarios normales
              <>
                <Link
                  to="/dashboard"
                  className={`btn btn-sm ${isActive("/dashboard") ? "btn-light" : "btn-outline-light"}`}
                >
                  <i className="bi bi-speedometer2 me-1"></i>
                  Dashboard
                </Link>

                <Link
                  to="/medicamentos"
                  className={`btn btn-sm ${isActive("/medicamentos") ? "btn-light" : "btn-outline-light"}`}
                >
                  <i className="bi bi-capsule me-1"></i>
                  Medicamentos
                </Link>

                <Link
                  to="/materiales"
                  className={`btn btn-sm ${isActive("/materiales") ? "btn-light" : "btn-outline-light"}`}
                >
                  <i className="bi bi-bandaid me-1"></i>
                  Materiales
                </Link>

                <Link
                  to="/recetas"
                  className={`btn btn-sm ${isActive("/recetas") ? "btn-light" : "btn-outline-light"}`}
                >
                  <i className="bi bi-prescription me-1"></i>
                  Recetas
                </Link>

                <Link
                  to="/pacientes"
                  className={`btn btn-sm ${isActive("/pacientes") ? "btn-light" : "btn-outline-light"}`}
                >
                  <i className="bi bi-people me-1"></i>
                  Pacientes
                </Link>

                <Link
                  to="/reportes"
                  className={`btn btn-sm ${isActive("/reportes") ? "btn-light" : "btn-outline-light"}`}
                >
                  <i className="bi bi-file-earmark-pdf me-1"></i>
                  Reportes
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
