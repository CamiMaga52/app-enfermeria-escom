"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { pacienteService } from "../../services/pacienteService"
import type { PacienteFormData } from "../../models/Paciente"
import NotificationModal from "../UI/NotificationModal"
import "./Pacientes.css"

interface PacienteFormProps {
  pacienteId?: number | null
  onSuccess: () => void
  onCancel: () => void
}

const PacienteForm: React.FC<PacienteFormProps> = ({ pacienteId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<PacienteFormData>({
    pacienteNombre: "",
    pacienteEscuela: "",
    pacienteEdad: 18,
    pacienteTelefono: "",
    pacienteEmail: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"success" | "error">("success")

  // Cargar datos del paciente si es edición
  useEffect(() => {
    if (pacienteId) {
      loadPacienteData()
    }
  }, [pacienteId])

  const loadPacienteData = async () => {
    try {
      setLoading(true)
      const response = await pacienteService.getById(pacienteId!)
      if (response.success && response.paciente) {
        const paciente = response.paciente
        setFormData({
          pacienteNombre: paciente.pacienteNombre,
          pacienteEscuela: paciente.pacienteEscuela || "",
          pacienteEdad: paciente.pacienteEdad || 18,
          pacienteTelefono: paciente.pacienteTelefono || "",
          pacienteEmail: paciente.pacienteEmail || "",
        })
      }
    } catch (err: any) {
      setError("Error cargando datos del paciente: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) || 0 : value,
    }))

    // Limpiar error del campo al cambiar
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.pacienteNombre.trim()) {
      errors.pacienteNombre = "El nombre es requerido"
    }

    if (!formData.pacienteEscuela.trim()) {
      errors.pacienteEscuela = "La escuela es requerida"
    }

    if (formData.pacienteEdad < 1 || formData.pacienteEdad > 120) {
      errors.pacienteEdad = "La edad debe estar entre 1 y 120 años"
    }

    if (formData.pacienteTelefono && !pacienteService.validarTelefono(formData.pacienteTelefono)) {
      errors.pacienteTelefono = "Teléfono inválido"
    }

    if (formData.pacienteEmail && !pacienteService.validarEmail(formData.pacienteEmail)) {
      errors.pacienteEmail = "Email inválido"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setError("Por favor corrige los errores en el formulario")
      return
    }

    setLoading(true)
    setError("")

    try {
      let response
      if (pacienteId) {
        response = await pacienteService.update(pacienteId, formData)
      } else {
        response = await pacienteService.create(formData)
      }

      if (response.success) {
        setNotificationMessage(pacienteId ? "Paciente actualizado exitosamente" : "Paciente creado exitosamente")
        setNotificationType("success")
        setShowNotification(true)
      } else {
        throw new Error(response.message || "Error en la operación")
      }
    } catch (err: any) {
      setError(err.message || "Error al guardar el paciente")
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

  if (loading && pacienteId) {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5>Editando Paciente</h5>
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
          <h5 className="modal-title">{pacienteId ? "✏️ Editar Paciente" : "➕ Nuevo Paciente"}</h5>
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
              {/* Nombre completo */}
              <div className="col-12">
                <label className="form-label">Nombre Completo *</label>
                <input
                  type="text"
                  className={`form-control ${formErrors.pacienteNombre ? "is-invalid" : ""}`}
                  name="pacienteNombre"
                  value={formData.pacienteNombre}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Ej: Juan Pérez López"
                />
                {formErrors.pacienteNombre && <div className="invalid-feedback">{formErrors.pacienteNombre}</div>}
              </div>

              {/* Escuela */}
              <div className="col-md-6">
                <label className="form-label">Escuela *</label>
                <input
                  type="text"
                  className={`form-control ${formErrors.pacienteEscuela ? "is-invalid" : ""}`}
                  name="pacienteEscuela"
                  value={formData.pacienteEscuela}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Ej: ESCOM, ESIME, etc."
                />
                {formErrors.pacienteEscuela && <div className="invalid-feedback">{formErrors.pacienteEscuela}</div>}
              </div>

              {/* Edad */}
              <div className="col-md-6">
                <label className="form-label">Edad *</label>
                <input
                  type="number"
                  className={`form-control ${formErrors.pacienteEdad ? "is-invalid" : ""}`}
                  name="pacienteEdad"
                  value={formData.pacienteEdad}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  required
                  disabled={loading}
                />
                {formErrors.pacienteEdad && <div className="invalid-feedback">{formErrors.pacienteEdad}</div>}
              </div>

              {/* Teléfono */}
              <div className="col-md-6">
                <label className="form-label">Teléfono</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <input
                    type="tel"
                    className={`form-control ${formErrors.pacienteTelefono ? "is-invalid" : ""}`}
                    name="pacienteTelefono"
                    value={formData.pacienteTelefono}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Ej: 5512345678"
                  />
                </div>
                {formErrors.pacienteTelefono && (
                  <div className="invalid-feedback d-block">{formErrors.pacienteTelefono}</div>
                )}
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className={`form-control ${formErrors.pacienteEmail ? "is-invalid" : ""}`}
                    name="pacienteEmail"
                    value={formData.pacienteEmail}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Ej: estudiante@ipn.mx"
                  />
                </div>
                {formErrors.pacienteEmail && <div className="invalid-feedback d-block">{formErrors.pacienteEmail}</div>}
              </div>

              {/* Información adicional */}
              <div className="col-12">
                <div className="alert alert-info mt-2">
                  <small>
                    <i className="bi bi-info-circle me-2"></i>
                    Los campos marcados con * son obligatorios. El teléfono y email son opcionales pero recomendados.
                  </small>
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
                  {pacienteId ? "Actualizando..." : "Creando..."}
                </>
              ) : pacienteId ? (
                "Actualizar Paciente"
              ) : (
                "Crear Paciente"
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

export default PacienteForm
