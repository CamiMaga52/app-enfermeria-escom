"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/authService"
import { reporteService } from "../services/reporteService"
import type { OpcionesFiltro, EstadisticasReporte } from "../services/reporteService"
import "./ReportesPage.css"
import NotificationModal from "../components/UI/NotificationModal"

const ReportesPage: React.FC = () => {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  const [opcionesFiltro, setOpcionesFiltro] = useState<OpcionesFiltro | null>(null)
  const [estadisticas, setEstadisticas] = useState<EstadisticasReporte | null>(null)
  const [periodo, setPeriodo] = useState<string>("Todos los períodos")
  const [mesSeleccionado, setMesSeleccionado] = useState<number>(0) // 0 = Todos
  const [añoSeleccionado, setAñoSeleccionado] = useState<number>(0) // 0 = Todos
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [initialLoad, setInitialLoad] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"success" | "error">("success")

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    cargarDatosIniciales()
  }, [navigate, user])

  useEffect(() => {
    const cargarEstadisticasConFiltros = async () => {
      // No cargar si es la carga inicial o si no tenemos opcionesFiltro
      if (initialLoad || !opcionesFiltro) {
        return
      }

      try {
        setLoading(true)
        const { estadisticas: stats, periodo: periodoText } = await reporteService.obtenerEstadisticas(
          mesSeleccionado || undefined,
          añoSeleccionado || undefined,
        )
        setEstadisticas(stats)
        setPeriodo(periodoText)
      } catch (err: any) {
        setError("Error actualizando filtros: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    cargarEstadisticasConFiltros()
  }, [mesSeleccionado, añoSeleccionado, opcionesFiltro, initialLoad])

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true)
      setInitialLoad(true)

      // Cargar opciones de filtro
      const opciones = await reporteService.obtenerOpcionesFiltro()
      setOpcionesFiltro(opciones)

      // Establecer mes y año actual por defecto
      setMesSeleccionado(opciones.mesActual)
      setAñoSeleccionado(opciones.añoActual)

      // Cargar estadísticas iniciales
      const { estadisticas: stats, periodo: periodoText } = await reporteService.obtenerEstadisticas(
        opciones.mesActual,
        opciones.añoActual,
      )
      setEstadisticas(stats)
      setPeriodo(periodoText)
    } catch (err: any) {
      setError("Error cargando datos iniciales: " + err.message)
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }

  const handleMesChange = (mes: number) => {
    setMesSeleccionado(mes)
  }

  const handleAñoChange = (año: number) => {
    setAñoSeleccionado(año)
  }

  const handleDescargarReporte = async (tipo: "medicamentos" | "materiales" | "recetas" | "consolidado") => {
    try {
      setLoading(true)
      setError("")

      const mes = mesSeleccionado || undefined
      const año = añoSeleccionado || undefined

      switch (tipo) {
        case "medicamentos":
          await reporteService.descargarReporteMedicamentos(mes, año)
          break
        case "materiales":
          await reporteService.descargarReporteMateriales(mes, año)
          break
        case "recetas":
          await reporteService.descargarReporteRecetas(mes, año)
          break
        case "consolidado":
          await reporteService.descargarReporteConsolidado(mes, año)
          break
      }

      setNotificationMessage(`Reporte de ${tipo} generado exitosamente. Se ha descargado el archivo PDF.`)
      setNotificationType("success")
      setShowNotification(true)
    } catch (err: any) {
      setError(`Error generando reporte: ${err.message}`)
      setNotificationMessage(`Error generando reporte: ${err.message}`)
      setNotificationType("error")
      setShowNotification(true)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
  }

  if (loading && !estadisticas) {
    return (
      <div className="reportes-page">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="reportes-page">
        <header className="reportes-header">
          <div className="container">
            <div className="header-content">
              <div className="brand">
                <h1>📊 Generador de Reportes</h1>
                <p>Sistema de Inventario - Enfermería ESCOM</p>
              </div>

              <div className="header-actions">
                <div className="user-info">
                  <div className="user-details">
                    <span className="user-name">{user?.nombre}</span>
                    <span className="user-role">{user?.rol}</span>
                  </div>
                  <button className="btn btn-outline-light btn-sm ms-3" onClick={() => navigate("/dashboard")}>
                    <i className="bi bi-speedometer2 me-2"></i>
                    Dashboard
                  </button>
                  <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Salir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="reportes-main">
          <div className="container">
            {/* Filtros */}
            <div className="filtros-container">
              <h3>Filtrar por Período</h3>
              <div className="filtros-row">
                <div className="filtro-group">
                  <label className="form-label">Mes</label>
                  <select
                    className="form-select"
                    value={mesSeleccionado}
                    onChange={(e) => handleMesChange(Number.parseInt(e.target.value))}
                    disabled={loading}
                  >
                    <option value="0">Todos los meses</option>
                    {opcionesFiltro?.meses.map((mes, index) => (
                      <option key={index} value={index + 1}>
                        {mes}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filtro-group">
                  <label className="form-label">Año</label>
                  <select
                    className="form-select"
                    value={añoSeleccionado}
                    onChange={(e) => handleAñoChange(Number.parseInt(e.target.value))}
                    disabled={loading}
                  >
                    <option value="0">Todos los años</option>
                    {opcionesFiltro?.años.map((año) => (
                      <option key={año} value={año}>
                        {año}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filtro-info">
                  <span className="periodo-actual">
                    Período seleccionado: <strong>{periodo}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {/* Vista previa de estadísticas */}
            {estadisticas && (
              <div className="estadisticas-preview">
                <h3>Vista Previa de Estadísticas</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">💊</div>
                    <div className="stat-content">
                      <h4>{estadisticas.medicamentos}</h4>
                      <p>Medicamentos</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🩹</div>
                    <div className="stat-content">
                      <h4>{estadisticas.materiales}</h4>
                      <p>Materiales</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                      <h4>{estadisticas.recetas}</h4>
                      <p>Recetas</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">👤</div>
                    <div className="stat-content">
                      <h4>{estadisticas.pacientes}</h4>
                      <p>Pacientes</p>
                    </div>
                  </div>

                  <div className="stat-card warning">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-content">
                      <h4>{estadisticas.stockBajo}</h4>
                      <p>Stock Bajo</p>
                    </div>
                  </div>

                  <div className="stat-card danger">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                      <h4>{estadisticas.proximosCaducar}</h4>
                      <p>Próximos a Caducar</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Opciones de reportes */}
            <div className="reportes-options">
              <h3>Generar Reportes PDF</h3>
              <p className="subtitle">Selecciona el tipo de reporte que deseas generar:</p>

              <div className="reportes-grid">
                {/* Reporte de Medicamentos */}
                <div className="reporte-card">
                  <div className="reporte-header">
                    <div className="reporte-icon">💊</div>
                    <div className="reporte-title">
                      <h4>Reporte de Medicamentos</h4>
                      <p>Listado completo de medicamentos con stock y caducidades</p>
                    </div>
                  </div>
                  <div className="reporte-content">
                    <ul className="reporte-features">
                      <li>
                        <i className="bi bi-check-circle"></i> Inventario completo
                      </li>
                      <li>
                        <i className="bi bi-check-circle"></i> Alertas de stock bajo
                      </li>
                      <li>
                        <i className="bi bi-check-circle"></i> Control de caducidades
                      </li>
                      <li>
                        <i className="bi bi-check-circle"></i> Estadísticas detalladas
                      </li>
                    </ul>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleDescargarReporte("medicamentos")}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Generando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-download me-2"></i>
                          Descargar PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Reporte de Materiales */}
                <div className="reporte-card">
                  <div className="reporte-header">
                    <div className="reporte-icon">🩹</div>
                    <div className="reporte-title">
                      <h4>Reporte de Materiales</h4>
                      <p>Inventario de materiales médicos y estado de mantenimiento</p>
                    </div>
                  </div>
                  <div className="reporte-content">
                    <ul className="reporte-features">
                      <li>
                        <i className="bi bi-check-circle"></i> Materiales disponibles
                      </li>
                      <li>
                        <i className="bi bi-check-circle"></i> Estado de mantenimiento
                      </li>
                      <li>
                        <i className="bi bi-check-circle"></i> Stock mínimo
                      </li>
                      <li>
                        <i className="bi bi-check-circle"></i> Valor del inventario
                      </li>
                    </ul>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleDescargarReporte("materiales")}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Generando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-download me-2"></i>
                          Descargar PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Reporte de Recetas */}
                <div className="reporte-card">
                  <div className="reporte-header">
                    <div className="reporte-icon">📝</div>
                    <div className="reporte-title">
                      <h4>Reporte de Recetas</h4>
                      <p>Historial de recetas médicas por período</p>
                    </div>
                  </div>
                  <div className="reporte-content">
                    <ul className="reporte-features">
                      <li>
                        <i className="bi bi-check-circle"></i> Recetas por período
                      </li>
                      <li>
                        <i className="bi bi-check-circle"></i> Diagnósticos comunes
                      </li>
                      <li>
                        <i className="bi bi-check-circle"></i> Médicos prescriptores
                      </li>
                      <li>
                        <i className="bi bi-check-circle"></i> Estado de recetas
                      </li>
                    </ul>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleDescargarReporte("recetas")}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Generando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-download me-2"></i>
                          Descargar PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Reporte Consolidado */}
                <div className="reporte-card destacado">
                  <div className="reporte-header">
                    <div className="reporte-icon">📊</div>
                    <div className="reporte-title">
                      <h4>Reporte Consolidado</h4>
                      <p>Informe completo del sistema con todas las estadísticas</p>
                    </div>
                  </div>
                  <div className="reporte-content">
                    <ul className="reporte-features">
                      <li>
                        <i className="bi bi-star-fill"></i> Resumen ejecutivo
                      </li>
                      <li>
                        <i className="bi bi-star-fill"></i> Todas las estadísticas
                      </li>
                      <li>
                        <i className="bi bi-star-fill"></i> Análisis completo
                      </li>
                      <li>
                        <i className="bi bi-star-fill"></i> Recomendaciones
                      </li>
                    </ul>
                    <button
                      className="btn btn-success w-100"
                      onClick={() => handleDescargarReporte("consolidado")}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Generando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-file-earmark-pdf me-2"></i>
                          Descargar Reporte Completo
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="info-adicional">
              <div className="alert alert-info">
                <h5>
                  <i className="bi bi-info-circle me-2"></i> Información Importante
                </h5>
                <ul className="mb-0">
                  <li>Los reportes se generan en formato PDF y se descargan automáticamente</li>
                  <li>Puedes filtrar los reportes por mes y año específicos</li>
                  <li>El reporte consolidado incluye todas las estadísticas del sistema</li>
                  <li>Los reportes incluyen información del usuario que los genera</li>
                  <li>Para reportes personalizados, contacta al administrador del sistema</li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        <footer className="reportes-footer">
          <div className="container">
            <p>© {new Date().getFullYear()} Sistema de Inventario - Enfermería ESCOM IPN</p>
            <small>Módulo de Reportes • Versión 1.0.0</small>
          </div>
        </footer>
      </div>

      <NotificationModal
        show={showNotification}
        message={notificationMessage}
        type={notificationType}
        onClose={() => setShowNotification(false)}
      />
    </>
  )
}

export default ReportesPage
