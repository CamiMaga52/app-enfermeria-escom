"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { materialService } from "../../services/materialService"
import type { Material } from "../../models/Material"
import MaterialForm from "./MaterialForm"
import MaterialDetail from "./MaterialDetail"
import NotificationModal from "../UI/NotificationModal"
import ConfirmModal from "../UI/ConfirmModal"
import "./Materiales.css"

const MaterialList: React.FC = () => {
  const [materiales, setMateriales] = useState<Material[]>([])
  const [filteredMateriales, setFilteredMateriales] = useState<Material[]>([])
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

  useEffect(() => {
    loadMateriales()
    loadEstadisticas()
  }, [])

  useEffect(() => {
    let filtered = materiales

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.materialNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.materialDesc.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterEstado !== "TODOS") {
      filtered = filtered.filter((m) => m.materialEstado === filterEstado)
    }

    setFilteredMateriales(filtered)
  }, [materiales, searchTerm, filterEstado])

  const loadMateriales = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await materialService.getAll()
      if (response.success) {
        setMateriales(response.materiales || [])
      } else {
        setError(response.message || "Error al cargar materiales")
      }
    } catch (err: any) {
      setError("Error de conexión: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadEstadisticas = async () => {
    try {
      const response = await materialService.getEstadisticas()
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
      const response = await materialService.delete(deleteId)
      if (response.success) {
        setNotificationMessage("Material eliminado exitosamente")
        setNotificationType("success")
        setShowNotification(true)
        loadMateriales()
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
    loadMateriales()
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

  if (loading && materiales.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando materiales...</p>
      </div>
    )
  }

  return (
    <>
      <div className="materiales-container">
        <div className="materiales-header">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Material
          </button>
        </div>

        {estadisticas && (
          <div className="estadisticas-container">
            <div className="estadistica-card">
              <div className="estadistica-icon">📦</div>
              <div className="estadistica-content">
                <h3>{estadisticas.totalMateriales || 0}</h3>
                <p>Total Materiales</p>
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
              <div className="estadistica-icon">🔧</div>
              <div className="estadistica-content">
                <h3>{estadisticas.enMantenimiento || 0}</h3>
                <p>En Mantenimiento</p>
              </div>
            </div>
          </div>
        )}

        <div className="filtros-container">
          <div className="search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o descripción..."
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
              <option value="DESGASTADO">Desgastado</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
            </select>
          </div>

          <button className="btn btn-outline-secondary" onClick={loadMateriales}>
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
                <th>Material</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Fecha Compra</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredMateriales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    <div className="empty-state">
                      <i className="bi bi-inbox empty-icon"></i>
                      <p>No se encontraron materiales</p>
                      {searchTerm && (
                        <button className="btn btn-link" onClick={() => setSearchTerm("")}>
                          Limpiar búsqueda
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMateriales.map((material) => (
                  <tr key={material.materialId}>
                    <td>{material.materialId}</td>
                    <td>
                      <strong>{material.materialNom}</strong>
                      {material.materialDesc && (
                        <small className="d-block text-muted">{material.materialDesc.substring(0, 60)}...</small>
                      )}
                    </td>
                    <td>
                      <span className="categoria-badge">{material.categoriaNombre || "Sin categoría"}</span>
                    </td>
                    <td>
                      <div className="stock-info">
                        <span
                          className={`stock-indicator ${materialService.getStockStatusClass(material.materialStock, material.materialStockMin)}`}
                        >
                          {material.materialStock}
                        </span>
                        <small className="text-muted"> / Mín: {material.materialStockMin}</small>
                      </div>
                    </td>
                    <td>
                      <span className={materialService.getEstadoClass(material.materialEstado)}>
                        {materialService.getEstadoText(material.materialEstado)}
                      </span>
                    </td>
                    <td>
                      {material.materialFecComp ? (
                        material.materialFecComp.split("T")[0]
                      ) : (
                        <span className="text-muted">No especificada</span>
                      )}
                    </td>
                    <td>${material.materialPrecio?.toFixed(2) || "0.00"}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewDetail(material.materialId)}
                          title="Ver detalles"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleEdit(material.materialId)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(material.materialId)}
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

        {filteredMateriales.length > 0 && (
          <div className="table-summary">
            <p>
              Mostrando <strong>{filteredMateriales.length}</strong> de <strong>{materiales.length}</strong> materiales
            </p>
          </div>
        )}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ backgroundColor: "white" }}>
              <MaterialForm materialId={editingId} onSuccess={handleCreateSuccess} onCancel={handleCloseForm} />
            </div>
          </div>
        )}

        {showDetail && (
          <div className="modal-overlay">
            <div className="modal-content">
              <MaterialDetail materialId={showDetail} onClose={handleCloseDetail} />
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        show={showConfirmModal}
        title="Eliminar Material"
        message="¿Estás seguro de que deseas eliminar este material? Esta acción no se puede deshacer."
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

export default MaterialList
