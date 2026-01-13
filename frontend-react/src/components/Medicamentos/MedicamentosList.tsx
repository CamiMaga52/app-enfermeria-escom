"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { medicamentoService } from "../../services/medicamentoService"
import type { Medicamento } from "../../models/Medicamento"
import MedicamentoForm from "./MedicamentoForm"
import MedicamentoDetail from "./MedicamentoDetail"
import NotificationModal from "../UI/NotificationModal"
import ConfirmModal from "../UI/ConfirmModal"
import "./Medicamentos.css"

const MedicamentosList: React.FC = () => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([])
  const [filteredMedicamentos, setFilteredMedicamentos] = useState<Medicamento[]>([])
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
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // Cargar medicamentos al inicio
  useEffect(() => {
    loadMedicamentos()
    loadEstadisticas()
  }, [])

  // Filtrar medicamentos cuando cambia searchTerm o filterEstado
  useEffect(() => {
    let filtered = medicamentos

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.medicamentoNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.medicamentoLote.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.medicamentoLaboratorio.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterEstado !== "TODOS") {
      filtered = filtered.filter((m) => m.medicamentoEstado === filterEstado)
    }

    setFilteredMedicamentos(filtered)
  }, [medicamentos, searchTerm, filterEstado])

  const loadMedicamentos = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await medicamentoService.getAll()
      if (response.success) {
        setMedicamentos(response.medicamentos || [])
      } else {
        setError(response.message || "Error al cargar medicamentos")
      }
    } catch (err: any) {
      setError("Error de conexión: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadEstadisticas = async () => {
    try {
      const response = await medicamentoService.getEstadisticas()
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
    setDeleteId(id)
    setShowConfirmModal(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      const response = await medicamentoService.delete(deleteId)
      if (response.success) {
        setNotificationMessage("Medicamento eliminado exitosamente")
        setNotificationType("success")
        setShowNotification(true)
        loadMedicamentos()
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
    loadMedicamentos()
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

  const getStockStatusClass = (stock: number, stockMin: number) => {
    if (stock === 0) return "stock-agotado"
    if (stock <= stockMin) return "stock-bajo"
    return "stock-normal"
  }

  if (loading && medicamentos.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando medicamentos...</p>
      </div>
    )
  }

  return (
    <>
      <div className="medicamentos-container">
        {/* Header con estadísticas */}
        <div className="medicamentos-header">
          <h2 style={{ color: "#ff6b35" }}>Gestión de Medicamentos</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Medicamento
          </button>
        </div>

        {/* Estadísticas */}
        {estadisticas && (
          <div className="estadisticas-container">
            <div className="estadistica-card">
              <div className="estadistica-icon">📊</div>
              <div className="estadistica-content">
                <h3>{estadisticas.totalMedicamentos || 0}</h3>
                <p>Total Medicamentos</p>
              </div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-icon">⚠️</div>
              <div className="estadistica-content">
                <h3>{estadisticas.stockBajo || 0}</h3>
                <p>Stock Bajo</p>
              </div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-icon">📅</div>
              <div className="estadistica-content">
                <h3>{estadisticas.proximosCaducar || 0}</h3>
                <p>Próximos a Caducar</p>
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
              placeholder="Buscar por nombre, lote o laboratorio..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <i className="bi bi-search search-icon"></i>
          </div>

          <div className="filter-box">
            <select className="form-select" value={filterEstado} onChange={handleFilterChange}>
              <option value="TODOS">Todos los estados</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="AGOTADO">Agotado</option>
              <option value="CADUCADO">Caducado</option>
              <option value="RESERVADO">Reservado</option>
            </select>
          </div>

          <button className="btn btn-outline-secondary" onClick={loadMedicamentos}>
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

        {/* Tabla de medicamentos */}
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Caducidad</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicamentos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    <div className="empty-state">
                      <i className="bi bi-inbox empty-icon"></i>
                      <p>No se encontraron medicamentos</p>
                      {searchTerm && (
                        <button className="btn btn-link" onClick={() => setSearchTerm("")}>
                          Limpiar búsqueda
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMedicamentos.map((medicamento) => {
                  const diasParaCaducar = medicamentoService.calcularDiasParaCaducar(medicamento.medicamentoFecCad)

                  return (
                    <tr key={medicamento.medicamentoId}>
                      <td>{medicamento.medicamentoId}</td>
                      <td>
                        <strong>{medicamento.medicamentoNom}</strong>
                        {medicamento.medicamentoDesc && (
                          <small className="d-block text-muted">
                            {medicamento.medicamentoDesc.substring(0, 50)}...
                          </small>
                        )}
                      </td>
                      <td>
                        <span className="categoria-badge">{medicamento.categoriaNombre || "Sin categoría"}</span>
                      </td>
                      <td>
                        <div className="stock-info">
                          <span
                            className={`stock-indicator ${getStockStatusClass(medicamento.medicamentoStock, medicamento.medicamentoStockMin)}`}
                          >
                            {medicamento.medicamentoStock}
                          </span>
                          <small className="text-muted"> / Mín: {medicamento.medicamentoStockMin}</small>
                        </div>
                      </td>
                      <td>
                        <span className={medicamentoService.getEstadoClass(medicamento.medicamentoEstado)}>
                          {medicamentoService.getEstadoText(medicamento.medicamentoEstado)}
                        </span>
                      </td>
                      <td>
                        {medicamento.medicamentoFecCad ? (
                          <div>
                            <div>{medicamento.medicamentoFecCad.split("T")[0]}</div>
                            {diasParaCaducar <= 30 && diasParaCaducar > 0 && (
                              <small className="text-warning">
                                <i className="bi bi-exclamation-triangle me-1"></i>
                                {diasParaCaducar} días
                              </small>
                            )}
                            {diasParaCaducar <= 0 && (
                              <small className="text-danger">
                                <i className="bi bi-x-circle me-1"></i>
                                Caducado
                              </small>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted">No especificada</span>
                        )}
                      </td>
                      <td>${medicamento.medicamentoPrecio?.toFixed(2) || "0.00"}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewDetail(medicamento.medicamentoId)}
                            title="Ver detalles"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleEdit(medicamento.medicamentoId)}
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(medicamento.medicamentoId)}
                            title="Eliminar"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Resumen */}
        {filteredMedicamentos.length > 0 && (
          <div className="table-summary">
            <p>
              Mostrando <strong>{filteredMedicamentos.length}</strong> de <strong>{medicamentos.length}</strong>{" "}
              medicamentos
            </p>
          </div>
        )}

        {/* Modal de formulario */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ backgroundColor: "white" }}>
              <MedicamentoForm medicamentoId={editingId} onSuccess={handleCreateSuccess} onCancel={handleCloseForm} />
            </div>
          </div>
        )}

        {/* Modal de detalle */}
        {showDetail && (
          <div className="modal-overlay">
            <div className="modal-content">
              <MedicamentoDetail medicamentoId={showDetail} onClose={handleCloseDetail} />
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        show={showConfirmModal}
        title="Eliminar Medicamento"
        message="¿Estás seguro de que deseas eliminar este medicamento? Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirmModal(false)
          setDeleteId(null)
        }}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
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

export default MedicamentosList
