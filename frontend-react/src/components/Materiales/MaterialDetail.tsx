import React, { useState, useEffect } from 'react';
import { materialService } from '../../services/materialService';
import type { Material } from '../../models/Material';
import './Materiales.css';

interface MaterialDetailProps {
  materialId: number;
  onClose: () => void;
}

const MaterialDetail: React.FC<MaterialDetailProps> = ({ materialId, onClose }) => {
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMaterial();
  }, [materialId]);

  const loadMaterial = async () => {
    try {
      setLoading(true);
      const response = await materialService.getById(materialId);
      
      if (response.success && response.material) {
        setMaterial(response.material);
      } else {
        setError(response.message || 'Material no encontrado');
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
      case 'DESGASTADO': return 'warning';
      case 'MANTENIMIENTO': return 'info';
      default: return 'secondary';
    }
  };

  const getStockStatus = (stock: number, stockMin: number) => {
    if (stock === 0) return { text: 'AGOTADO', class: 'danger' };
    if (stock <= stockMin) return { text: 'BAJO', class: 'warning' };
    return { text: 'NORMAL', class: 'success' };
  };

  if (loading) {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Detalles del Material</h5>
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

  if (!material) {
    return null;
  }

  const stockStatus = getStockStatus(material.materialStock, material.materialStockMin);

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">
          <i className="bi bi-bandaid me-2"></i>
          Detalles del Material Médico
        </h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <div className="modal-body">
        {/* Encabezado con ID y nombre */}
        <div className="detail-header mb-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h3 className="mb-1">{material.materialNom}</h3>
              <p className="text-muted mb-0">ID: #{material.materialId}</p>
            </div>
            <span className={`badge bg-${getEstadoColor(material.materialEstado)} fs-6`}>
              {materialService.getEstadoText(material.materialEstado)}
            </span>
          </div>
          
          {material.materialDesc && (
            <p className="mt-3 text-muted">{material.materialDesc}</p>
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
                  <dt>Categoría:</dt>
                  <dd>
                    <span className="badge bg-light text-dark border">
                      {material.categoriaNombre || 'Sin categoría'}
                    </span>
                  </dd>
                </div>
                <div className="detail-item">
                  <dt>Fecha Compra:</dt>
                  <dd>{formatDate(material.materialFecComp)}</dd>
                </div>
                <div className="detail-item">
                  <dt>Precio Unitario:</dt>
                  <dd className="text-success fw-bold">
                    ${material.materialPrecio?.toFixed(2) || '0.00'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Stock */}
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
                      {material.materialStock} unidades
                    </span>
                    <small className="text-muted ms-2">
                      (Mínimo: {material.materialStockMin})
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
                      {material.created_at 
                        ? new Date(material.created_at).toLocaleString('es-MX')
                        : 'No disponible'}
                    </dd>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-item">
                    <dt>Última Actualización:</dt>
                    <dd>
                      {material.updated_at 
                        ? new Date(material.updated_at).toLocaleString('es-MX')
                        : 'No disponible'}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alertas importantes */}
          {material.materialStock <= material.materialStockMin && (
            <div className="col-12">
              <div className="alert alert-warning">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>Alerta de Stock Bajo:</strong> El inventario está por debajo del nivel mínimo. 
                Considera realizar un nuevo pedido.
              </div>
            </div>
          )}

          {material.materialEstado === 'DESGASTADO' && (
            <div className="col-12">
              <div className="alert alert-warning">
                <i className="bi bi-tools me-2"></i>
                <strong>Material Desgastado:</strong> Este material muestra signos de desgaste. 
                Considera su reemplazo o mantenimiento.
              </div>
            </div>
          )}

          {material.materialEstado === 'MANTENIMIENTO' && (
            <div className="col-12">
              <div className="alert alert-info">
                <i className="bi bi-wrench me-2"></i>
                <strong>En Mantenimiento:</strong> Este material está actualmente en proceso de 
                mantenimiento o calibración. No está disponible para uso.
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
      </div>
    </div>
  );
};

export default MaterialDetail;
