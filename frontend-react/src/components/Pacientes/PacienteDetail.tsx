import React, { useState, useEffect } from 'react';
import { pacienteService } from '../../services/pacienteService';
import type { Paciente } from '../../models/Paciente';
import './Pacientes.css';

interface PacienteDetailProps {
  pacienteId: number;
  onClose: () => void;
}

const PacienteDetail: React.FC<PacienteDetailProps> = ({ pacienteId, onClose }) => {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPaciente();
  }, [pacienteId]);

  const loadPaciente = async () => {
    try {
      setLoading(true);
      const response = await pacienteService.getById(pacienteId);
      
      if (response.success && response.paciente) {
        setPaciente(response.paciente);
      } else {
        setError(response.message || 'Paciente no encontrado');
      }
    } catch (err: any) {
      setError('Error cargando detalles: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getEdadCategoria = (edad: number): string => {
    if (edad < 18) return 'Menor de edad';
    if (edad >= 18 && edad <= 25) return 'Joven universitario';
    if (edad > 25 && edad <= 40) return 'Adulto joven';
    if (edad > 40 && edad <= 60) return 'Adulto';
    return 'Adulto mayor';
  };

  if (loading) {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Detalles del Paciente</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Error</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
          <div className="text-center">
            <button className="btn btn-primary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!paciente) {
    return null;
  }

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">
          <i className="bi bi-person-circle me-2"></i>
          Detalles del Paciente
        </h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <div className="modal-body">
        {/* Encabezado con ID y nombre */}
        <div className="detail-header mb-4">
          <div className="text-center">
            <div className="avatar-circle mb-3">
              <span className="avatar-text">
                {paciente.pacienteNombre.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <h3 className="mb-1">{paciente.pacienteNombre}</h3>
            <p className="text-muted mb-0">ID: #{paciente.pacienteId}</p>
          </div>
        </div>

        {/* Grid de información */}
        <div className="row g-4">
          {/* Información personal */}
          <div className="col-md-6">
            <div className="detail-card">
              <h6 className="detail-card-title">
                <i className="bi bi-person-badge me-2"></i>
                Información Personal
              </h6>
              <dl className="detail-list">
                <div className="detail-item">
                  <dt>Edad:</dt>
                  <dd>
                    <span className={`edad-badge ${pacienteService.getEdadClass(paciente.pacienteEdad)}`}>
                      {paciente.pacienteEdad} años
                    </span>
                    <small className="text-muted ms-2">
                      ({getEdadCategoria(paciente.pacienteEdad)})
                    </small>
                  </dd>
                </div>
                <div className="detail-item">
                  <dt>Escuela:</dt>
                  <dd>
                    <span className="escuela-detalle">
                      {paciente.pacienteEscuela}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="col-md-6">
            <div className="detail-card">
              <h6 className="detail-card-title">
                <i className="bi bi-telephone me-2"></i>
                Información de Contacto
              </h6>
              <dl className="detail-list">
                <div className="detail-item">
                  <dt>Teléfono:</dt>
                  <dd>
                    {paciente.pacienteTelefono ? (
                      <div className="contacto-info">
                        <i className="bi bi-telephone-fill me-2 text-primary"></i>
                        <a href={`tel:${paciente.pacienteTelefono}`} className="text-decoration-none">
                          {paciente.pacienteTelefono}
                        </a>
                      </div>
                    ) : (
                      <span className="text-muted">No registrado</span>
                    )}
                  </dd>
                </div>
                <div className="detail-item">
                  <dt>Email:</dt>
                  <dd>
                    {paciente.pacienteEmail ? (
                      <div className="contacto-info">
                        <i className="bi bi-envelope-fill me-2 text-primary"></i>
                        <a href={`mailto:${paciente.pacienteEmail}`} className="text-decoration-none">
                          {paciente.pacienteEmail}
                        </a>
                      </div>
                    ) : (
                      <span className="text-muted">No registrado</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Información adicional */}
          <div className="col-12">
            <div className="detail-card">
              <h6 className="detail-card-title">
                <i className="bi bi-clock-history me-2"></i>
                Información Adicional
              </h6>
              <div className="row">
                <div className="col-md-6">
                  <div className="detail-item">
                    <dt>Fecha de Registro:</dt>
                    <dd>
                      {paciente.created_at 
                        ? pacienteService.formatDate(paciente.created_at)
                        : 'No disponible'}
                    </dd>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-item">
                    <dt>ID Único:</dt>
                    <dd>
                      <code className="id-unico">PAC-{paciente.pacienteId.toString().padStart(4, '0')}</code>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notas importantes */}
          <div className="col-12">
            <div className="alert alert-info">
              <h6>
                <i className="bi bi-info-circle me-2"></i>
                Información Importante
              </h6>
              <ul className="mb-0">
                <li>Este paciente puede recibir atención médica en la enfermería ESCOM</li>
                <li>La información de contacto puede ser usada para seguimiento</li>
                <li>Los datos médicos deben mantenerse confidenciales</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onClose}
        >
          <i className="bi bi-x-lg me-2"></i>
          Cerrar
        </button>
        <button 
          type="button" 
          className="btn btn-outline-primary"
          onClick={() => {
            onClose();
            // Aquí podrías agregar navegación a recetas si lo implementas
          }}
        >
          <i className="bi bi-file-medical me-2"></i>
          Ver Historial
        </button>
      </div>
    </div>
  );
};

export default PacienteDetail;
