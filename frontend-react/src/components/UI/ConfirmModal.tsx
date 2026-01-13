"use client"

import type React from "react"
import "./ConfirmModal.css"

interface ConfirmModalProps {
  show: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info"
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger",
}) => {
  if (!show) return null

  const getIcon = () => {
    switch (type) {
      case "danger":
        return "🗑️"
      case "warning":
        return "⚠️"
      case "info":
        return "ℹ️"
      default:
        return "❓"
    }
  }

  const getButtonClass = () => {
    switch (type) {
      case "danger":
        return "btn-danger"
      case "warning":
        return "btn-warning"
      case "info":
        return "btn-info"
      default:
        return "btn-primary"
    }
  }

  return (
    <>
      <div className="modal show d-block confirm-modal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <span className="me-2">{getIcon()}</span>
                {title}
              </h5>
              <button type="button" className="btn-close" onClick={onCancel}></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">{message}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                {cancelText}
              </button>
              <button type="button" className={`btn ${getButtonClass()}`} onClick={onConfirm}>
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  )
}

export default ConfirmModal
