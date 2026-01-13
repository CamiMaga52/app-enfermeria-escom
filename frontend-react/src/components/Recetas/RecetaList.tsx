"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { recetaService } from "../../services/recetaService"
import type { Receta } from "../../models/Receta"
import RecetaForm from "./RecetaForm"
import RecetaDetail from "./RecetaDetail"
import NotificationModal from "../UI/NotificationModal"
import ConfirmModal from "../UI/ConfirmModal"
import "./Recetas.css"

const RecetaList: React.FC = () => {
  const [recetas, setRecetas] = useState<Receta[]>([])
  const [filteredRecetas, setFilteredRecetas] = useState<Receta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("TODOS")
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [estadisticas, setEstadisticas] = useState<any>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"success" | "error">("success")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmMessage, setConfirmMessage] = useState("")
  const [confirmTitle, setConfirmTitle] = useState("")

  useEffect(() => {
    loadRecetas()
    loadEstadisticas()
  }, [])

  useEffect(() => {
    let filtered = recetas

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.recetaFolio.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.recetaDiag.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.pacienteNombre && r.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (filterEstado !== "TODOS") {
      filtered = filtered.filter((r) => r.recetaEstado === filterEstado)
    }

    setFilteredRecetas(filtered)
  }, [recetas, searchTerm, filterEstado])

  const loadRecetas = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await recetaService.getAll()
      if (response.success) {
        setRecetas(response.recetas || [])
      } else {
        setError(response.message || "Error al cargar recetas")
      }
    } catch (err: any) {
      setError("Error de conexión: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadEstadisticas = async () => {
    try {
      const response = await recetaService.getEstadisticas()
      if (response.success) {
        setEstadisticas(response)
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterEstado(e.target.value)
  }

  const handleDelete = async (id: number) => {
    setConfirmTitle("Eliminar Receta")
    setConfirmMessage("¿Estás seguro de que deseas eliminar esta receta? Esta acción no se puede deshacer.")
    setConfirmAction(() => async () => {
      try {
        const response = await recetaService.delete(id)
        if (response.success) {
          setNotificationMessage("Receta eliminada exitosamente")
          setNotificationType("success")
          setShowNotification(true)
          loadRecetas()
          loadEstadisticas()
        } else {
          setNotificationMessage("Error: " + response.message)
          setNotificationType("error")
          setShowNotification(true)
        }
      } catch (error: any) {
        setNotificationMessage("Error: " + error.message)
        setNotificationType("error")
        setShowNotification(true)
      } finally {
        setShowConfirmModal(false)
      }
    })
    setShowConfirmModal(true)
  }

  const handleCreateSuccess = () => {
    setShowForm(false)
    setEditingId(null)
    loadRecetas()
    loadEstadisticas()
  }

  const handleEdit = (id: number) => {
    setEditingId(id)
    setShowForm(true)
  }

  const handleViewDetail = (id: number) => {
    setShowDetail(id)
  }

  const handleCloseDetail = () => {
    setShowDetail(null)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingId(null)
  }

  const handleCambiarEstado = async (id: number, nuevoEstado: string) => {
    setConfirmTitle("Cambiar Estado")
    setConfirmMessage(`¿Estás seguro de cambiar el estado a ${nuevoEstado}?`)
    setConfirmAction(() => async () => {
      try {
        const response = await recetaService.cambiarEstado(id, nuevoEstado)
        if (response.success) {
          setNotificationMessage(`Estado cambiado a ${nuevoEstado}`)
          setNotificationType("success")
          setShowNotification(true)
          loadRecetas()
        } else {
          setNotificationMessage("Error: " + response.message)
          setNotificationType("error")
          setShowNotification(true)
        }
      } catch (error: any) {
        setNotificationMessage("Error: " + error.message)
        setNotificationType("error")
        setShowNotification(true)
      } finally {
        setShowConfirmModal(false)
      }
    })
    setShowConfirmModal(true)
  }

  if (loading && recetas.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando recetas...</p>
      </div>
    )
  }

  return (
    <>
      <div className="recetas-container">
        <div className="recetas-header">
          <h2 style={{ color: "#ff6b35" }}>📝 Gestión de Recetas Médicas</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <i className="bi bi-file-earmark-plus me-2"></i>
            Nueva Receta
          </button>
        </div>

        {/* Estadísticas */}
        {estadisticas && (
          <div className="estadisticas-container">
            <div className="estadistica-card">
              <div className="estadistica-icon">📋</div>
              <div className="estadistica-content">
                <h3>{estadisticas.totalRecetas || 0}</h3>
                <p>Total Recetas</p>
              </div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-icon">✅</div>
              <div className="estadistica-content">
                <h3>{estadisticas.activas || 0}</h3>
                <p>Recetas Activas</p>
              </div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-icon">🏁</div>
              <div className="estadistica-content">
                <h3>{estadisticas.completadas || 0}</h3>
                <p>Recetas Completadas</p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros y búsqueda */}
        <div className="filtros-container">
          <div className="search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por folio, diagnóstico o paciente..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <i className="bi bi-search search-icon"></i>
          </div>

          <div className="filter-box">
            <select className="form-select" value={filterEstado} onChange={handleFilterChange}>
              <option value="TODOS">Todos los estados</option>
              <option value="ACTIVA">Activa</option>
              <option value="COMPLETADA">Completada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>

          <button className="btn btn-outline-secondary" onClick={loadRecetas}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Actualizar
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* Tabla de recetas */}
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Fecha</th>
                <th>Paciente</th>
                <th>Diagnóstico</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecetas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <div className="empty-state">
                      <i className="bi bi-file-earmark-medical empty-icon"></i>
                      <p>No se encontraron recetas</p>
                      {searchTerm && (
                        <button className="btn btn-link" onClick={() => setSearchTerm("")}>
                          Limpiar búsqueda
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecetas.map((receta) => (
                  <tr key={receta.recetaId}>
                    <td>
                      <strong className="folio-text">{receta.recetaFolio}</strong>
                    </td>
                    <td>{recetaService.formatDate(receta.recetaFecha)}</td>
                    <td>
                      <span className="paciente-info">{receta.pacienteNombre || `Paciente #${receta.pacienteId}`}</span>
                    </td>
                    <td>
                      <div className="diagnostico-info">
                        <strong>{receta.recetaDiag}</strong>
                        {receta.recetaObs && (
                          <small className="d-block text-muted">{receta.recetaObs.substring(0, 60)}...</small>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={recetaService.getEstadoClass(receta.recetaEstado)}>
                        {recetaService.getEstadoText(receta.recetaEstado)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewDetail(receta.recetaId)}
                          title="Ver detalles"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleEdit(receta.recetaId)}
                          title="Editar"
                          disabled={receta.recetaEstado !== "ACTIVA"}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-info dropdown-toggle"
                            data-bs-toggle="dropdown"
                            title="Cambiar estado"
                          >
                            <i className="bi bi-arrow-repeat"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleCambiarEstado(receta.recetaId, "COMPLETADA")}
                                disabled={receta.recetaEstado === "COMPLETADA"}
                              >
                                <i className="bi bi-check-circle me-2"></i>
                                Marcar como Completada
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleCambiarEstado(receta.recetaId, "CANCELADA")}
                                disabled={receta.recetaEstado === "CANCELADA"}
                              >
                                <i className="bi bi-x-circle me-2"></i>
                                Cancelar Receta
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleCambiarEstado(receta.recetaId, "ACTIVA")}
                                disabled={receta.recetaEstado === "ACTIVA"}
                              >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Reactivar
                              </button>
                            </li>
                          </ul>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(receta.recetaId)}
                          title="Eliminar"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Resumen */}
        {filteredRecetas.length > 0 && (
          <div className="table-summary">
            <p>
              Mostrando <strong>{filteredRecetas.length}</strong> de <strong>{recetas.length}</strong> recetas
            </p>
          </div>
        )}

        {/* Modal de formulario */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content modal-lg" style={{ backgroundColor: "white" }}>
              <RecetaForm recetaId={editingId} onSuccess={handleCreateSuccess} onCancel={handleCloseForm} />
            </div>
          </div>
        )}

        {/* Modal de detalle */}
        {showDetail && (
          <div className="modal-overlay">
            <div className="modal-content modal-lg">
              <RecetaDetail recetaId={showDetail} onClose={handleCloseDetail} />
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        show={showConfirmModal}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={confirmAction}
        onCancel={() => setShowConfirmModal(false)}
        confirmText="Confirmar"
        cancelText="Cancelar"
        type="warning"
      />

      {/* Modal de notificación */}
      <NotificationModal
        show={showNotification}
        message={notificationMessage}
        type={notificationType}
        onClose={() => setShowNotification(false)}
      />
    </>
  )
}

export default RecetaList
