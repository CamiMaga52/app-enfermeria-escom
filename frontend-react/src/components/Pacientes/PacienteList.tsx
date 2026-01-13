"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { pacienteService } from "../../services/pacienteService"
import type { Paciente } from "../../models/Paciente"
import PacienteForm from "./PacienteForm"
import PacienteDetail from "./PacienteDetail"
import NotificationModal from "../UI/NotificationModal"
import ConfirmModal from "../UI/ConfirmModal"
import "./Pacientes.css"

const PacienteList: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [estadisticas, setEstadisticas] = useState<any>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"success" | "error">("success")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    loadPacientes()
    loadEstadisticas()
  }, [])

  useEffect(() => {
    let filtered = pacientes

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.pacienteEscuela.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.pacienteEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.pacienteTelefono.includes(searchTerm),
      )
    }

    setFilteredPacientes(filtered)
  }, [pacientes, searchTerm])

  const loadPacientes = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await pacienteService.getAll()
      if (response.success) {
        setPacientes(response.pacientes || [])
      } else {
        setError(response.message || "Error al cargar pacientes")
      }
    } catch (err: any) {
      setError("Error de conexión: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadEstadisticas = async () => {
    try {
      const response = await pacienteService.getEstadisticas()
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

  const handleDelete = async (id: number) => {
    setDeleteId(id)
    setShowConfirmModal(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      const response = await pacienteService.delete(deleteId)
      if (response.success) {
        setNotificationMessage("Paciente eliminado exitosamente")
        setNotificationType("success")
        setShowNotification(true)
        loadPacientes()
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
      setDeleteId(null)
    }
  }

  const handleCreateSuccess = () => {
    setShowForm(false)
    setEditingId(null)
    loadPacientes()
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

  if (loading && pacientes.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando pacientes...</p>
      </div>
    )
  }

  return (
    <>
      <div className="pacientes-container">
        <div className="pacientes-header">
          <h2 style={{ color: "#ff6b35" }}></h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <i className="bi bi-person-plus me-2"></i>
            Nuevo Paciente
          </button>
        </div>

        {estadisticas && (
          <div className="estadisticas-container">
            <div className="estadistica-card">
              <div className="estadistica-icon">👥</div>
              <div className="estadistica-content">
                <h3>{estadisticas.totalPacientes || 0}</h3>
                <p>Total Pacientes</p>
              </div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-icon">🎓</div>
              <div className="estadistica-content">
                <h3>{estadisticas.escuelasUnicas || 0}</h3>
                <p>Escuelas Diferentes</p>
              </div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-icon">📊</div>
              <div className="estadistica-content">
                <h3>{estadisticas.promedioEdad || 0}</h3>
                <p>Edad Promedio</p>
              </div>
            </div>
          </div>
        )}

        <div className="filtros-container">
          <div className="search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, escuela, email o teléfono..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <i className="bi bi-search search-icon"></i>
          </div>

          <button className="btn btn-outline-secondary" onClick={loadPacientes}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Actualizar
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Escuela</th>
                <th>Edad</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPacientes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    <div className="empty-state">
                      <i className="bi bi-people empty-icon"></i>
                      <p>No se encontraron pacientes</p>
                      {searchTerm && (
                        <button className="btn btn-link" onClick={() => setSearchTerm("")}>
                          Limpiar búsqueda
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPacientes.map((paciente) => (
                  <tr key={paciente.pacienteId}>
                    <td>{paciente.pacienteId}</td>
                    <td>
                      <strong>{paciente.pacienteNombre}</strong>
                    </td>
                    <td>
                      <span className="escuela-badge">{paciente.pacienteEscuela}</span>
                    </td>
                    <td>
                      <span className={`edad-indicator ${pacienteService.getEdadClass(paciente.pacienteEdad)}`}>
                        {paciente.pacienteEdad} años
                      </span>
                    </td>
                    <td>
                      <div className="telefono-info">
                        <i className="bi bi-telephone me-2"></i>
                        {paciente.pacienteTelefono}
                      </div>
                    </td>
                    <td>
                      <div className="email-info">
                        <i className="bi bi-envelope me-2"></i>
                        <a href={`mailto:${paciente.pacienteEmail}`} className="email-link">
                          {paciente.pacienteEmail}
                        </a>
                      </div>
                    </td>
                    <td>{pacienteService.formatDate(paciente.created_at)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewDetail(paciente.pacienteId)}
                          title="Ver detalles"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleEdit(paciente.pacienteId)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(paciente.pacienteId)}
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

        {filteredPacientes.length > 0 && (
          <div className="table-summary">
            <p>
              Mostrando <strong>{filteredPacientes.length}</strong> de <strong>{pacientes.length}</strong> pacientes
            </p>
          </div>
        )}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ backgroundColor: "white" }}>
              <PacienteForm pacienteId={editingId} onSuccess={handleCreateSuccess} onCancel={handleCloseForm} />
            </div>
          </div>
        )}

        {showDetail && (
          <div className="modal-overlay">
            <div className="modal-content">
              <PacienteDetail pacienteId={showDetail} onClose={handleCloseDetail} />
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        show={showConfirmModal}
        title="Eliminar Paciente"
        message="¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirmModal(false)
          setDeleteId(null)
        }}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      <NotificationModal
        show={showNotification}
        message={notificationMessage}
        type={notificationType}
        onClose={() => setShowNotification(false)}
      />
    </>
  )
}

export default PacienteList
