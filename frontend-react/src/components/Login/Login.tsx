"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../services/authService"
import "./Login.css"

const Login: React.FC = () => {
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking")
  const navigate = useNavigate()

  // Verificar estado de la API al cargar
  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      await authService.checkApiHealth()
      setApiStatus("online")
    } catch (err) {
      setApiStatus("offline")
      setError(
        "El backend no está disponible. Asegúrate de que el servidor Spring Boot esté corriendo en http://localhost:8080",
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!correo.trim() || !password.trim()) {
      setError("Correo y contraseña son requeridos")
      setLoading(false)
      return
    }

    try {
      console.log("Intentando login con:", { correo, password })
      const result = await authService.login({ correo, password })
      console.log("Respuesta del login:", result)

      if (result.success) {
        const user = authService.getCurrentUser()
        const userRole = (user?.rol || user?.rol_nombre || "").toUpperCase()

        console.log("[v0] User role detected:", userRole)

        // Si es ADMIN, redirigir a /admin
        if (userRole === "ADMIN" || userRole === "ADMINISTRADOR") {
          console.log("[v0] Redirecting to /admin")
          navigate("/admin")
        } else {
          // Si es cualquier otro rol (médico, enfermero, etc.), redirigir a /dashboard
          console.log("[v0] Redirecting to /dashboard")
          navigate("/dashboard")
        }
      } else {
        setError(result.error || "Error en el login")
      }
    } catch (err: any) {
      console.error("Error completo:", err)

      if (err.response) {
        // Error de respuesta del servidor
        setError(err.response.data?.error || `Error ${err.response.status}: ${err.response.statusText}`)
      } else if (err.request) {
        // Error de red (no hubo respuesta)
        setError(
          "No se pudo conectar con el servidor. Verifica: 1) Spring Boot está corriendo, 2) Puerto 8080 está abierto, 3) No hay problemas de CORS",
        )
      } else {
        // Error en la configuración
        setError("Error de configuración: " + err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTestCredentials = (testCorreo: string) => {
    setCorreo(testCorreo)
    setPassword("password123")
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>🏥 SIGIE</h1>
            <p>Sistema Integral de Gestión de Inventario de Enfermería</p>

            {apiStatus === "checking" && (
              <div className="alert alert-info mt-3">Verificando conexión con el servidor...</div>
            )}

            {apiStatus === "offline" && (
              <div className="alert alert-danger mt-3">
                ⚠️ Backend no disponible. Ejecuta: cd api → mvn spring-boot:run
              </div>
            )}

            {apiStatus === "online" && (
              <div className="alert alert-success mt-3">✅ Backend conectado correctamente</div>
            )}
          </div>

          <div className="login-body">
            <h2 className="text-center mb-4">Iniciar Sesión</h2>

            {error && (
              <div className="alert alert-danger">
                <strong>Error:</strong> {error}
                <button type="button" className="btn-close" onClick={() => setError("")} style={{ float: "right" }}>
                  ×
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="ejemplo@escom.mx"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  disabled={loading || apiStatus === "offline"}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || apiStatus === "offline"}
                />
                <small className="text-muted">Modo desarrollo: Cualquier contraseña no vacía es válida</small>
              </div>

              <button type="submit" className="btn btn-primary mt-4" disabled={loading || apiStatus === "offline"}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>

            <div className="test-credentials">
              <h6 className="text-center">Credenciales de Prueba</h6>
              <div className="credentials-grid">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => handleTestCredentials("admin@escom.mx")}
                  disabled={loading}
                >
                  👨‍💼 Admin
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => handleTestCredentials("enfermera@escom.mx")}
                  disabled={loading}
                >
                  👩‍⚕️ Enfermera
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => handleTestCredentials("medico@escom.mx")}
                  disabled={loading}
                >
                  🩺 Médico
                </button>
              </div>
            </div>
          </div>

          <div className="login-footer">
            <p>Sistema de Inventario v1.0 • ESCOM IPN</p>
            <small>Backend: {apiStatus === "online" ? "🟢 Conectado" : "🔴 Desconectado"}</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
