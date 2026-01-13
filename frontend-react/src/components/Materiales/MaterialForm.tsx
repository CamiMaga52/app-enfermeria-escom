"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { materialService } from "../../services/materialService"
import type { MaterialFormData, Categoria } from "../../models/Medicamento" // Reutilizamos Categoria
import "./Materiales.css"
import NotificationModal from "../UI/NotificationModal"

interface MaterialFormProps {
  materialId?: number | null
  onSuccess: () => void
  onCancel: () => void
}

const MaterialForm: React.FC<MaterialFormProps> = ({ materialId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<MaterialFormData>({
    materialNom: "",
    materialDesc: "",
    materialFecComp: "",
    materialEstado: "DISPONIBLE",
    materialStock: 0,
    materialStockMin: 5,
    materialPrecio: 0,
    categoriaId: 1,
  })

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"success" | "error">("success")

  // Cargar categorías y datos del material si es edición
  useEffect(() => {
    loadCategorias()
    if (materialId) {
      loadMaterialData()
    }
  }, [materialId])

  const loadCategorias = async () => {
    try {
      // Reutilizamos el mismo servicio de categorías de medicamentos
      const medicamentoService = await import("../../services/medicamentoService")
      const categoriasData = await medicamentoService.medicamentoService.getCategorias()
      setCategorias(categoriasData)
    } catch (err) {
      console.error("Error cargando categorías:", err)
    }
  }

  const loadMaterialData = async () => {
    try {
      setLoading(true)
      const response = await materialService.getById(materialId!)
      if (response.success && response.material) {
        const material = response.material
        setFormData({
          materialNom: material.materialNom,
          materialDesc: material.materialDesc || "",
          materialFecComp: materialService.formatDateForInput(material.materialFecComp),
          materialEstado: material.materialEstado,
          materialStock: material.materialStock,
          materialStockMin: material.materialStockMin,
          materialPrecio: material.materialPrecio || 0,
          categoriaId: material.categoriaId || 1,
        })
      }
    } catch (err: any) {
      setError("Error cargando datos del material: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validaciones básicas
      if (!formData.materialNom.trim()) {
        throw new Error("El nombre del material es requerido")
      }

      if (formData.materialStock < 0) {
        throw new Error("El stock no puede ser negativo")
      }

      let response
      if (materialId) {
        // Actualizar
        response = await materialService.update(materialId, formData)
      } else {
        // Crear nuevo
        response = await materialService.create(formData)
      }

      if (response.success) {
        setNotificationMessage(materialId ? "Material actualizado exitosamente" : "Material creado exitosamente")
        setNotificationType("success")
        setShowNotification(true)
      } else {
        throw new Error(response.message || "Error en la operación")
      }
    } catch (err: any) {
      setError(err.message || "Error al guardar el material")
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClose = () => {
    setShowNotification(false)
    if (notificationType === "success") {
      onSuccess()
    }
  }

  if (loading && materialId) {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5>Editando Material</h5>
          <button type="button" className="btn-close" onClick={onCancel}></button>
        </div>
        <div className="modal-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{materialId ? "✏️ Editar Material" : "➕ Nuevo Material Médico"}</h5>
          <button type="button" className="btn-close" onClick={onCancel} disabled={loading}></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <div className="row g-3">
              {/* Nombre y Categoría */}
              <div className="col-md-6">
                <label className="form-label">Nombre del Material *</label>
                <input
                  type="text"
                  className="form-control"
                  name="materialNom"
                  value={formData.materialNom}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Seleccionar categoría...</option>
                  {categorias.map((cat) => (
                    <option key={cat.categoriaId} value={cat.categoriaId}>
                      {cat.categoriaNom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción */}
              <div className="col-12">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  name="materialDesc"
                  value={formData.materialDesc}
                  onChange={handleChange}
                  rows={2}
                  disabled={loading}
                />
              </div>

              {/* Fecha de compra */}
              <div className="col-md-6">
                <label className="form-label">Fecha de Compra</label>
                <input
                  type="date"
                  className="form-control"
                  name="materialFecComp"
                  value={formData.materialFecComp}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Estado */}
              <div className="col-md-6">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  name="materialEstado"
                  value={formData.materialEstado}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="AGOTADO">Agotado</option>
                  <option value="DESGASTADO">Desgastado</option>
                  <option value="MANTENIMIENTO">En Mantenimiento</option>
                </select>
              </div>

              {/* Stock */}
              <div className="col-md-4">
                <label className="form-label">Stock Actual *</label>
                <input
                  type="number"
                  className="form-control"
                  name="materialStock"
                  value={formData.materialStock}
                  onChange={handleChange}
                  min="0"
                  required
                  disabled={loading}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Stock Mínimo</label>
                <input
                  type="number"
                  className="form-control"
                  name="materialStockMin"
                  value={formData.materialStockMin}
                  onChange={handleChange}
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Precio Unitario ($)</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    name="materialPrecio"
                    value={formData.materialPrecio}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {materialId ? "Actualizando..." : "Creando..."}
                </>
              ) : materialId ? (
                "Actualizar Material"
              ) : (
                "Crear Material"
              )}
            </button>
          </div>
        </form>
      </div>

      <NotificationModal
        show={showNotification}
        message={notificationMessage}
        type={notificationType}
        onClose={handleNotificationClose}
      />
    </>
  )
}

export default MaterialForm
