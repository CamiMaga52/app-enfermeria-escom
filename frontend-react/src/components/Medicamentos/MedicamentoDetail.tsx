import React, { useState, useEffect } from 'react';
import { medicamentoService } from '../../services/medicamentoService';
import type { Medicamento } from '../../models/Medicamento';
import './Medicamentos.css';

interface MedicamentoDetailProps {
  medicamentoId: number;
  onClose: () => void;
}

const MedicamentoDetail: React.FC<MedicamentoDetailProps> = ({ medicamentoId, onClose }) => {
  const [medicamento, setMedicamento] = useState<Medicamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMedicamento();
  }, [medicamentoId]);

  const loadMedicamento = async () => {
    try {
      setLoading(true);
      const response = await medicamentoService.getById(medicamentoId);
      
      if (response.success && response.medicamento) {
        setMedicamento(response.medicamento);
      } else {
        setError(response.message || 'Medicamento no encontrado');
      }
    } catch (err: any) {
      setError('Error cargando detalles: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE': return 'success';
      case 'AGOTADO': return 'danger';
      case 'CADUCADO': return 'warning';
      case 'RESERVADO': return 'info';
      default: return 'secondary';
    }
  };

  const getStockStatus = (stock: number, stockMin: number) => {
    if (stock === 0) return { text: 'AGOTADO', class: 'danger' };
    if (stock <= stockMin) return { text: 'BAJO', class: 'warning' };
    return { text: 'NORMAL', class: 'success' };
  };

  const calcularDiasCaducidad = (fechaCaducidad: string | null) => {
    if (!fechaCaducidad) return null;
    const hoy = new Date();
    const caducidad = new Date(fechaCaducidad);
    const diffTime = caducidad.getTime() - hoy.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Detalles del Medicamento</h5>
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

  if (!medicamento) {
    return null;
  }

  const stockStatus = getStockStatus(medicamento.medicamentoStock, medicamento.medicamentoStockMin);
  const diasCaducidad = calcularDiasCaducidad(medicamento.medicamentoFecCad);

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">
          <i className="bi bi-capsule-pill me-2"></i>
          Detalles del Medicamento
        </h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <div className="modal-body">
        {/* Encabezado con ID y nombre */}
        <div className="detail-header mb-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h3 className="mb-1">{medicamento.medicamentoNom}</h3>
              <p className="text-muted mb-0">ID: #{medicamento.medicamentoId}</p>
            </div>
            <span className={`badge bg-${getEstadoColor(medicamento.medicamentoEstado)} fs-6`}>
              {medicamentoService.getEstadoText(medicamento.medicamentoEstado)}
            </span>
          </div>
          
          {medicamento.medicamentoDesc && (
            <p className="mt-3 text-muted">{medicamento.medicamentoDesc}</p>
          )}
        </div>

        {/* Grid de información */}
        <div className="row g-4">
          {/* Información básica */}
          <div className="col-md-6">
            <div className="detail-card">
              <h6 className="detail-card-title">
                <i className="bi bi-info-circle me-2"></i>
                Información Básica
              </h6>
              <dl className="detail-list">
                <div className="detail-item">
                  <dt>Laboratorio:</dt>
                  <dd>{medicamento.medicamentoLaboratorio || 'No especificado'}</dd>
                </div>
                <div className="detail-item">
                  <dt>Lote:</dt>
                  <dd>{medicamento.medicamentoLote || 'No especificado'}</dd>
                </div>
                <div className="detail-item">
                  <dt>Categoría:</dt>
                  <dd>
                    <span className="badge bg-light text-dark border">
                      {medicamento.categoriaNombre || 'Sin categoría'}
                    </span>
                  </dd>
                </div>
                <div className="detail-item">
                  <dt>Precio Unitario:</dt>
                  <dd className="text-success fw-bold">
                    ${medicamento.medicamentoPrecio?.toFixed(2) || '0.00'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Stock y fechas */}
          <div className="col-md-6">
            <div className="detail-card">
              <h6 className="detail-card-title">
                <i className="bi bi-box-seam me-2"></i>
                Inventario
              </h6>
              <dl className="detail-list">
                <div className="detail-item">
                  <dt>Stock Actual:</dt>
                  <dd>
                    <span className={`badge bg-${stockStatus.class}`}>
                      {medicamento.medicamentoStock} unidades
                    </span>
                    <small className="text-muted ms-2">
                      (Mínimo: {medicamento.medicamentoStockMin})
                    </small>
                  </dd>
                </div>
                <div className="detail-item">
                  <dt>Estado Stock:</dt>
                  <dd>
                    <span className={`badge bg-${stockStatus.class}`}>
                      {stockStatus.text}
                    </span>
                  </dd>
                </div>
                <div className="detail-item">
                  <dt>Fecha Compra:</dt>
                  <dd>{formatDate(medicamento.medicamentoFecComp)}</dd>
                </div>
                <div className="detail-item">
                  <dt>Fecha Caducidad:</dt>
                  <dd>
                    <div className="d-flex align-items-center">
                      <span>{formatDate(medicamento.medicamentoFecCad)}</span>
                      {diasCaducidad !== null && (
                        <span className={`badge ms-2 bg-${diasCaducidad <= 0 ? 'danger' : diasCaducidad <= 30 ? 'warning' : 'success'}`}>
                          {diasCaducidad <= 0 
                            ? 'CADUCADO' 
                            : `${diasCaducidad} días restantes`}
                        </span>
                      )}
                    </div>
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
                    <dt>Creado:</dt>
                    <dd>
                      {medicamento.created_at 
                        ? new Date(medicamento.created_at).toLocaleString('es-MX')
                        : 'No disponible'}
                    </dd>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-item">
                    <dt>Última Actualización:</dt>
                    <dd>
                      {medicamento.updated_at 
                        ? new Date(medicamento.updated_at).toLocaleString('es-MX')
                        : 'No disponible'}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alertas importantes */}
          {medicamento.medicamentoStock <= medicamento.medicamentoStockMin && (
            <div className="col-12">
              <div className="alert alert-warning">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>Alerta de Stock Bajo:</strong> El inventario está por debajo del nivel mínimo. 
                Considera realizar un nuevo pedido.
              </div>
            </div>
          )}

          {diasCaducidad !== null && diasCaducidad <= 30 && diasCaducidad > 0 && (
            <div className="col-12">
              <div className="alert alert-warning">
                <i className="bi bi-calendar-x me-2"></i>
                <strong>Próximo a Caducar:</strong> Este medicamento caduca en {diasCaducidad} días. 
                Úsalo prioritariamente o considera retirarlo del inventario.
              </div>
            </div>
          )}

          {diasCaducidad !== null && diasCaducidad <= 0 && (
            <div className="col-12">
              <div className="alert alert-danger">
                <i className="bi bi-x-circle-fill me-2"></i>
                <strong>MEDICAMENTO CADUCADO:</strong> Este producto ha pasado su fecha de caducidad. 
                No debe ser administrado a pacientes. Retira del inventario inmediatamente.
              </div>
            </div>
          )}
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
            // Aquí podrías agregar navegación a edición si lo necesitas
          }}
        >
          <i className="bi bi-printer me-2"></i>
          Imprimir Información
        </button>
      </div>
    </div>
  );
};

export default MedicamentoDetail;
