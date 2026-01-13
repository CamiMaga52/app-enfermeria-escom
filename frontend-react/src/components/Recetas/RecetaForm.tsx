"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { recetaService } from "../../services/recetaService"
import { pacienteService } from "../../services/pacienteService"
import { medicamentoService } from "../../services/medicamentoService"
import type { RecetaFormData, DetalleRecetaFormData, Paciente, Medicamento } from "../../models"
import "./Recetas.css"
import NotificationModal from "../UI/NotificationModal"

interface RecetaFormProps {
  recetaId?: number | null
  onSuccess: () => void
  onCancel: () => void
}

const RecetaForm: React.FC<RecetaFormProps> = ({ recetaId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<RecetaFormData>({
    recetaDiag: "",
    recetaObs: "",
    pacienteId: 0,
    detalles: [],
  })

  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"success" | "error" | "warning">("success")

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData()
    if (recetaId) {
      loadRecetaData()
    } else {
      // Agregar un detalle vacío por defecto
      setFormData((prev) => ({
        ...prev,
        detalles: [
          {
            detRecetaMed: "",
            detRecetaCant: 1,
            detRecetaDosis: "",
            detRecetaDur: "",
            detRecetaIndicaciones: "",
            medicamentoId: null,
          },
        ],
      }))
    }
  }, [recetaId])

  const loadInitialData = async () => {
    try {
      setLoadingData(true)

      // Cargar pacientes
      const pacientesRes = await pacienteService.getAll()
      if (pacientesRes.success) {
        setPacientes(pacientesRes.pacientes || [])
      }

      // Cargar medicamentos
      const medicamentosRes = await medicamentoService.getAll()
      if (medicamentosRes.success) {
        setMedicamentos(medicamentosRes.medicamentos || [])
      }
    } catch (err: any) {
      console.error("Error cargando datos iniciales:", err)
    } finally {
      setLoadingData(false)
    }
  }

  const loadRecetaData = async () => {
    try {
      setLoadingData(true)
      const response = await recetaService.getById(recetaId!)
      if (response.success && response.recetaCompleta) {
        const { receta, detalles } = response.recetaCompleta
        setFormData({
          recetaDiag: receta.recetaDiag,
          recetaObs: receta.recetaObs || "",
          pacienteId: receta.pacienteId,
          detalles: detalles.map((d) => ({
            detRecetaMed: d.detRecetaMed,
            detRecetaCant: d.detRecetaCant,
            detRecetaDosis: d.detRecetaDosis || "",
            detRecetaDur: d.detRecetaDur || "",
            detRecetaIndicaciones: d.detRecetaIndicaciones || "",
            medicamentoId: d.medicamentoId,
          })),
        })
      }
    } catch (err: any) {
      setError("Error cargando datos de la receta: " + err.message)
    } finally {
      setLoadingData(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDetalleChange = (index: number, field: keyof DetalleRecetaFormData, value: any) => {
    setFormData((prev) => {
      const nuevosDetalles = [...prev.detalles]
      nuevosDetalles[index] = {
        ...nuevosDetalles[index],
        [field]: field === "medicamentoId" && value === "" ? null : value,
      }
      return { ...prev, detalles: nuevosDetalles }
    })
  }

  const agregarDetalle = () => {
    setFormData((prev) => ({
      ...prev,
      detalles: [
        ...prev.detalles,
        {
          detRecetaMed: "",
          detRecetaCant: 1,
          detRecetaDosis: "",
          detRecetaDur: "",
          detRecetaIndicaciones: "",
          medicamentoId: null,
        },
      ],
    }))
  }

  const eliminarDetalle = (index: number) => {
    if (formData.detalles.length <= 1) {
      setNotificationMessage("La receta debe tener al menos un medicamento")
      setNotificationType("warning")
      setShowNotification(true)
      return
    }

    setFormData((prev) => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones
    if (!formData.pacienteId) {
      setError("Debe seleccionar un paciente")
      return
    }

    if (!formData.recetaDiag.trim()) {
      setError("El diagnóstico es requerido")
      return
    }

    if (formData.detalles.length === 0) {
      setError("Debe agregar al menos un medicamento")
      return
    }

    for (const detalle of formData.detalles) {
      if (!detalle.detRecetaMed.trim()) {
        setError("Todos los medicamentos deben tener un nombre")
        return
      }
      if (detalle.detRecetaCant <= 0) {
        setError("La cantidad debe ser mayor a 0")
        return
      }
    }

    setLoading(true)
    setError("")

    try {
      let response
      if (recetaId) {
        response = await recetaService.update(recetaId, formData)
      } else {
        response = await recetaService.create(formData)
      }

      if (response.success) {
        setNotificationMessage(recetaId ? "Receta actualizada exitosamente" : "Receta creada exitosamente")
        setNotificationType("success")
        setShowNotification(true)
      } else {
        throw new Error(response.message || "Error en la operación")
      }
    } catch (err: any) {
      setError(err.message || "Error al guardar la receta")
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

  if (loadingData) {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5>{recetaId ? "Editando Receta" : "Nueva Receta"}</h5>
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
          <h5 className="modal-title">{recetaId ? "✏️ Editar Receta" : "📝 Nueva Receta Médica"}</h5>
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
              {/* Selección de paciente */}
              <div className="col-md-6">
                <label className="form-label">Paciente *</label>
                <select
                  className="form-select"
                  name="pacienteId"
                  value={formData.pacienteId || ""}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Seleccionar paciente...</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.pacienteId} value={paciente.pacienteId}>
                      {paciente.pacienteNombre} - {paciente.pacienteEscuela}
                    </option>
                  ))}
                </select>
              </div>

              {/* Diagnóstico */}
              <div className="col-md-6">
                <label className="form-label">Diagnóstico *</label>
                <input
                  type="text"
                  className="form-control"
                  name="recetaDiag"
                  value={formData.recetaDiag}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Ej: Gripe común, Infección respiratoria, etc."
                />
              </div>

              {/* Observaciones */}
              <div className="col-12">
                <label className="form-label">Observaciones</label>
                <textarea
                  className="form-control"
                  name="recetaObs"
                  value={formData.recetaObs}
                  onChange={handleChange}
                  rows={2}
                  disabled={loading}
                  placeholder="Notas adicionales sobre el paciente..."
                />
              </div>

              {/* Detalles de medicamentos */}
              <div className="col-12">
                <div className="detalles-header">
                  <h6 className="mb-0">Medicamentos Recetados</h6>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={agregarDetalle}
                    disabled={loading}
                  >
                    <i className="bi bi-plus-lg me-1"></i>
                    Agregar Medicamento
                  </button>
                </div>

                <div className="detalles-container">
                  {formData.detalles.map((detalle, index) => (
                    <div key={index} className="detalle-card">
                      <div className="detalle-header">
                        <h6 className="mb-0">Medicamento {index + 1}</h6>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminarDetalle(index)}
                          disabled={loading || formData.detalles.length <= 1}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>

                      <div className="row g-2 mt-2">
                        {/* Medicamento (selección o texto libre) */}
                        <div className="col-md-6">
                          <label className="form-label">Medicamento *</label>
                          <div className="input-group">
                            <select
                              className="form-control"
                              value={detalle.medicamentoId || ""}
                              onChange={(e) => handleDetalleChange(index, "medicamentoId", e.target.value)}
                              disabled={loading}
                            >
                              <option value="">Seleccionar medicamento...</option>
                              {medicamentos.map((med) => (
                                <option key={med.medicamentoId} value={med.medicamentoId}>
                                  {med.medicamentoNom} ({med.medicamentoStock} disponibles)
                                </option>
                              ))}
                            </select>
                            <span className="input-group-text">o</span>
                            <input
                              type="text"
                              className="form-control"
                              value={detalle.detRecetaMed}
                              onChange={(e) => handleDetalleChange(index, "detRecetaMed", e.target.value)}
                              disabled={loading}
                              placeholder="Nombre del medicamento"
                            />
                          </div>
                        </div>

                        {/* Cantidad */}
                        <div className="col-md-3">
                          <label className="form-label">Cantidad *</label>
                          <input
                            type="number"
                            className="form-control"
                            value={detalle.detRecetaCant}
                            onChange={(e) =>
                              handleDetalleChange(index, "detRecetaCant", Number.parseInt(e.target.value))
                            }
                            min="1"
                            required
                            disabled={loading}
                          />
                        </div>

                        {/* Dosis */}
                        <div className="col-md-3">
                          <label className="form-label">Dosis</label>
                          <input
                            type="text"
                            className="form-control"
                            value={detalle.detRecetaDosis}
                            onChange={(e) => handleDetalleChange(index, "detRecetaDosis", e.target.value)}
                            disabled={loading}
                            placeholder="Ej: 1 tableta cada 8 horas"
                          />
                        </div>

                        {/* Duración */}
                        <div className="col-md-6">
                          <label className="form-label">Duración</label>
                          <input
                            type="text"
                            className="form-control"
                            value={detalle.detRecetaDur}
                            onChange={(e) => handleDetalleChange(index, "detRecetaDur", e.target.value)}
                            disabled={loading}
                            placeholder="Ej: 7 días"
                          />
                        </div>

                        {/* Indicaciones */}
                        <div className="col-md-6">
                          <label className="form-label">Indicaciones</label>
                          <input
                            type="text"
                            className="form-control"
                            value={detalle.detRecetaIndicaciones}
                            onChange={(e) => handleDetalleChange(index, "detRecetaIndicaciones", e.target.value)}
                            disabled={loading}
                            placeholder="Ej: Tomar con alimentos"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
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
                  {recetaId ? "Actualizando..." : "Creando..."}
                </>
              ) : recetaId ? (
                "Actualizar Receta"
              ) : (
                "Crear Receta"
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

export default RecetaForm
