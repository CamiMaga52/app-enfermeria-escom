import api from './api';
import type { 
  Receta, 
  RecetaCompleta, 
  RecetaFormData, 
  RecetaResponse,
  DetalleReceta,
  DetalleRecetaFormData 
} from '../models/Receta';

export const recetaService = {
  // Obtener todas las recetas
  async getAll(): Promise<RecetaResponse> {
    try {
      const response = await api.get('/recetas');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener receta por ID con detalles
  async getById(id: number): Promise<RecetaResponse> {
    try {
      const response = await api.get(`/recetas/${id}/completa`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener recetas por paciente
  async getByPaciente(pacienteId: number): Promise<RecetaResponse> {
    try {
      const response = await api.get(`/recetas/paciente/${pacienteId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nueva receta con detalles
  async create(data: RecetaFormData): Promise<RecetaResponse> {
    try {
      const response = await api.post('/recetas', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar receta
  async update(id: number, data: Partial<RecetaFormData>): Promise<RecetaResponse> {
    try {
      const response = await api.put(`/recetas/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cambiar estado de receta
  async cambiarEstado(id: number, estado: string): Promise<RecetaResponse> {
    try {
      const response = await api.patch(`/recetas/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar receta
  async delete(id: number): Promise<RecetaResponse> {
    try {
      const response = await api.delete(`/recetas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar recetas por folio o diagnóstico
  async search(termino: string): Promise<RecetaResponse> {
    try {
      const response = await api.get(`/recetas/buscar?termino=${encodeURIComponent(termino)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener estadísticas
  async getEstadisticas(): Promise<RecetaResponse> {
    try {
      const response = await api.get('/recetas/estadisticas');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Helper: Generar folio
  generarFolio(): string {
    const fecha = new Date();
    const año = fecha.getFullYear().toString().slice(-2);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `REC-${año}${mes}${dia}-${random}`;
  },

  // Helper: Formatear fecha
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Helper: Obtener clase CSS para estado
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'ACTIVA': return 'badge bg-primary';
      case 'COMPLETADA': return 'badge bg-success';
      case 'CANCELADA': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  },

  // Helper: Obtener texto para estado
  getEstadoText(estado: string): string {
    switch (estado) {
      case 'ACTIVA': return 'Activa';
      case 'COMPLETADA': return 'Completada';
      case 'CANCELADA': return 'Cancelada';
      default: return estado;
    }
  }
};
