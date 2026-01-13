"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { medicamentoService } from "../../services/medicamentoService"
import type { MedicamentoFormData, Categoria } from "../../models/Medicamento"
import "./Medicamentos.css"
import NotificationModal from "../UI/NotificationModal"

interface MedicamentoFormProps {
  medicamentoId?: number | null
  onSuccess: () => void
  onCancel: () => void
}

const MedicamentoForm: React.FC<MedicamentoFormProps> = ({ medicamentoId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<MedicamentoFormData>({
    medicamentoNom: "",
    medicamentoDesc: "",
    medicamentoFecComp: "",
    medicamentoFecCad: "",
    medicamentoLote: "",
    medicamentoLaboratorio: "",
    medicamentoEstado: "DISPONIBLE",
    medicamentoStock: 0,
    medicamentoStockMin: 10,
    medicamentoPrecio: 0,
    categoriaId: 1,
  })

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"success" | "error">("success")

  useEffect(() => {
    loadCategorias()
    if (medicamentoId) {
      loadMedicamentoData()
    }
  }, [medicamentoId])

  const loadCategorias = async () => {
    try {
      const categoriasData = await medicamentoService.getCategorias()
      setCategorias(categoriasData)
    } catch (err) {
      console.error("Error cargando categorías:", err)
    }
  }

  const loadMedicamentoData = async () => {
    try {
      setLoading(true)
      const response = await medicamentoService.getById(medicamentoId!)
      if (response.success && response.medicamento) {
        const medicamento = response.medicamento
        setFormData({
          medicamentoNom: medicamento.medicamentoNom,
          medicamentoDesc: medicamento.medicamentoDesc || "",
          medicamentoFecComp: medicamentoService.formatDateForInput(medicamento.medicamentoFecComp),
          medicamentoFecCad: medicamentoService.formatDateForInput(medicamento.medicamentoFecCad),
          medicamentoLote: medicamento.medicamentoLote || "",
          medicamentoLaboratorio: medicamento.medicamentoLaboratorio || "",
          medicamentoEstado: medicamento.medicamentoEstado,
          medicamentoStock: medicamento.medicamentoStock,
          medicamentoStockMin: medicamento.medicamentoStockMin,
          medicamentoPrecio: medicamento.medicamentoPrecio || 0,
          categoriaId: medicamento.categoriaId || 1,
        })
      }
    } catch (err: any) {
      setError("Error cargando datos del medicamento: " + err.message)
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
      if (!formData.medicamentoNom.trim()) {
        throw new Error("El nombre del medicamento es requerido")
      }

      if (formData.medicamentoStock < 0) {
        throw new Error("El stock no puede ser negativo")
      }

      if (formData.medicamentoFecCad && formData.medicamentoFecComp) {
        const fechaComp = new Date(formData.medicamentoFecComp)
        const fechaCad = new Date(formData.medicamentoFecCad)
        if (fechaCad < fechaComp) {
          throw new Error("La fecha de caducidad no puede ser anterior a la fecha de compra")
        }
      }

      let response
      if (medicamentoId) {
        response = await medicamentoService.update(medicamentoId, formData)
      } else {
        response = await medicamentoService.create(formData)
      }

      if (response.success) {
        setNotificationMessage(
          medicamentoId ? "Medicamento actualizado exitosamente" : "Medicamento creado exitosamente",
        )
        setNotificationType("success")
        setShowNotification(true)
      } else {
        throw new Error(response.message || "Error en la operación")
      }
    } catch (err: any) {
      setError(err.message || "Error al guardar el medicamento")
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

  if (loading && medicamentoId) {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5>Editando Medicamento</h5>
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
          <h5 className="modal-title">{medicamentoId ? "✏️ Editar Medicamento" : "➕ Nuevo Medicamento"}</h5>
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
              <div className="col-md-6">
                <label className="form-label">Nombre del Medicamento *</label>
                <input
                  type="text"
                  className="form-control"
                  name="medicamentoNom"
                  value={formData.medicamentoNom}
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

              <div className="col-12">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  name="medicamentoDesc"
                  value={formData.medicamentoDesc}
                  onChange={handleChange}
                  rows={2}
                  disabled={loading}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Laboratorio</label>
                <input
                  type="text"
                  className="form-control"
                  name="medicamentoLaboratorio"
                  value={formData.medicamentoLaboratorio}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Número de Lote</label>
                <input
                  type="text"
                  className="form-control"
                  name="medicamentoLote"
                  value={formData.medicamentoLote}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Fecha de Compra</label>
                <input
                  type="date"
                  className="form-control"
                  name="medicamentoFecComp"
                  value={formData.medicamentoFecComp}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Fecha de Caducidad</label>
                <input
                  type="date"
                  className="form-control"
                  name="medicamentoFecCad"
                  value={formData.medicamentoFecCad}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Stock Actual *</label>
                <input
                  type="number"
                  className="form-control"
                  name="medicamentoStock"
                  value={formData.medicamentoStock}
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
                  name="medicamentoStockMin"
                  value={formData.medicamentoStockMin}
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
                    name="medicamentoPrecio"
                    value={formData.medicamentoPrecio}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  name="medicamentoEstado"
                  value={formData.medicamentoEstado}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="AGOTADO">Agotado</option>
                  <option value="CADUCADO">Caducado</option>
                  <option value="RESERVADO">Reservado</option>
                </select>
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
                  {medicamentoId ? "Actualizando..." : "Creando..."}
                </>
              ) : medicamentoId ? (
                "Actualizar Medicamento"
              ) : (
                "Crear Medicamento"
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

export default MedicamentoForm
