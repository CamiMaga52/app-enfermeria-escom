"use client"

import type React from "react"
import "./NotificationModal.css"

export interface NotificationModalProps {
  show: boolean
  title?: string
  message: string
  type?: "success" | "error" | "warning" | "info"
  onClose: () => void
}

const NotificationModal: React.FC<NotificationModalProps> = ({ show, title, message, type = "info", onClose }) => {
  if (!show) return null

  const getIcon = () => {
    switch (type) {
      case "success":
        return <i className="bi bi-check-circle-fill text-success"></i>
      case "error":
        return <i className="bi bi-x-circle-fill text-danger"></i>
      case "warning":
        return <i className="bi bi-exclamation-triangle-fill text-warning"></i>
      default:
        return <i className="bi bi-info-circle-fill text-info"></i>
    }
  }

  const getDefaultTitle = () => {
    switch (type) {
      case "success":
        return "Éxito"
      case "error":
        return "Error"
      case "warning":
        return "Advertencia"
      default:
        return "Información"
    }
  }

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div className="notification-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={`notification-modal-header ${type}`}>
          <div className="notification-icon">{getIcon()}</div>
          <h5 className="notification-title">{title || getDefaultTitle()}</h5>
        </div>
        <div className="notification-modal-body">
          <p>{message}</p>
        </div>
        <div className="notification-modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationModal
