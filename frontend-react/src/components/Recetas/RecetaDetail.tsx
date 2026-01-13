import React, { useState, useEffect } from 'react';
import { recetaService } from '../../services/recetaService';
import type { RecetaCompleta, DetalleReceta } from '../../models/Receta';
import './Recetas.css';

interface RecetaDetailProps {
  recetaId: number;
  onClose: () => void;
}

const RecetaDetail: React.FC<RecetaDetailProps> = ({ recetaId, onClose }) => {
  const [recetaCompleta, setRecetaCompleta] = useState<RecetaCompleta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReceta();
  }, [recetaId]);

  const loadReceta = async () => {
    try {
      setLoading(true);
      const response = await recetaService.getById(recetaId);
      
      if (response.success && response.recetaCompleta) {
        setRecetaCompleta(response.recetaCompleta);
      } else {
        setError(response.message || 'Receta no encontrada');
      }
    } catch (err: any) {
      setError('Error cargando detalles: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Detalles de la Receta</h5>
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

  if (!recetaCompleta) {
    return null;
  }

  const { receta, detalles } = recetaCompleta;

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">
          <i className="bi bi-file-earmark-medical me-2"></i>
          Receta Médica
        </h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <div className="modal-body">
        {/* Encabezado de la receta */}
        <div className="receta-header mb-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h3 className="mb-1">Receta #{receta.recetaFolio}</h3>
              <p className="text-muted mb-0">
                {recetaService.formatDate(receta.recetaFecha)}
              </p>
            </div>
            <span className={recetaService.getEstadoClass(receta.recetaEstado)}>
              {recetaService.getEstadoText(receta.recetaEstado)}
            </span>
          </div>
        </div>

        {/* Información del paciente */}
        <div className="detail-card mb-4">
          <h6 className="detail-card-title">
            <i className="bi bi-person-circle me-2"></i>
            Información del Paciente
          </h6>
          <div className="row">
            <div className="col-md-6">
              <div className="detail-item">
                <dt>Nombre:</dt>
                <dd><strong>{receta.pacienteNombre || `Paciente #${receta.pacienteId}`}</strong></dd>
              </div>
            </div>
            <div className="col-md-6">
              <div className="detail-item">
                <dt>Atendido por:</dt>
                <dd>{receta.usuarioNombre || 'Personal de enfermería'}</dd>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnóstico y observaciones */}
        <div className="detail-card mb-4">
          <h6 className="detail-card-title">
            <i className="bi bi-clipboard-check me-2"></i>
            Diagnóstico y Observaciones
          </h6>
          <div className="row">
            <div className="col-md-6">
              <div className="detail-item">
                <dt>Diagnóstico:</dt>
                <dd><strong>{receta.recetaDiag}</strong></dd>
              </div>
            </div>
            {receta.recetaObs && (
              <div className="col-md-6">
                <div className="detail-item">
                  <dt>Observaciones:</dt>
                  <dd>{receta.recetaObs}</dd>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Medicamentos recetados */}
        <div className="detail-card mb-4">
          <h6 className="detail-card-title">
            <i className="bi bi-capsule-pill me-2"></i>
            Medicamentos Recetados
          </h6>
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>Cantidad</th>
                  <th>Dosis</th>
                  <th>Duración</th>
                  <th>Indicaciones</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle: DetalleReceta, index: number) => (
                  <tr key={detalle.detRecetaId || index}>
                    <td>
                      <div>
                        <strong>{detalle.detRecetaMed}</strong>
                        {detalle.medicamentoNombre && (
                          <small className="d-block text-muted">
                            {detalle.medicamentoNombre}
                          </small>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="cantidad-badge">
                        {detalle.detRecetaCant} unidades
                      </span>
                    </td>
                    <td>{detalle.detRecetaDosis || '-'}</td>
                    <td>{detalle.detRecetaDur || '-'}</td>
                    <td>{detalle.detRecetaIndicaciones || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-end mt-3">
            <small className="text-muted">
              Total: {detalles.length} medicamento(s)
            </small>
          </div>
        </div>

        {/* Información adicional */}
        <div className="detail-card">
          <h6 className="detail-card-title">
            <i className="bi bi-info-circle me-2"></i>
            Información Adicional
          </h6>
          <div className="row">
            <div className="col-md-6">
              <div className="detail-item">
                <dt>Fecha de Creación:</dt>
                <dd>
                  {receta.created_at 
                    ? recetaService.formatDate(receta.created_at)
                    : 'No disponible'}
                </dd>
              </div>
            </div>
            <div className="col-md-6">
              <div className="detail-item">
                <dt>ID de Receta:</dt>
                <dd>
                  <code className="id-receta">#{receta.recetaId}</code>
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Instrucciones importantes */}
        <div className="alert alert-info mt-4">
          <h6>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Instrucciones Importantes
          </h6>
          <ul className="mb-0">
            <li>Tomar los medicamentos según las indicaciones del personal médico</li>
            <li>Completar el tratamiento completo incluso si se siente mejor</li>
            <li>Consultar en caso de efectos secundarios o reacciones adversas</li>
            <li>Regresar a control si los síntomas persisten</li>
          </ul>
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
          className="btn btn-primary"
          onClick={handleImprimir}
        >
          <i className="bi bi-printer me-2"></i>
          Imprimir Receta
        </button>
      </div>
    </div>
  );
};

export default RecetaDetail;
