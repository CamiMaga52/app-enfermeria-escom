import api from './api';
import type { Medicamento, MedicamentoFormData, MedicamentoResponse, Categoria } from '../models/Medicamento';

export const medicamentoService = {
  // Obtener todos los medicamentos
  async getAll(): Promise<MedicamentoResponse> {
    try {
      const response = await api.get('/medicamentos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener medicamento por ID
  async getById(id: number): Promise<MedicamentoResponse> {
    try {
      const response = await api.get(`/medicamentos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo medicamento
  async create(data: MedicamentoFormData): Promise<MedicamentoResponse> {
    try {
      const response = await api.post('/medicamentos', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar medicamento
  async update(id: number, data: Partial<MedicamentoFormData>): Promise<MedicamentoResponse> {
    try {
      const response = await api.put(`/medicamentos/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar medicamento
  async delete(id: number): Promise<MedicamentoResponse> {
    try {
      const response = await api.delete(`/medicamentos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar medicamentos por nombre
  async search(nombre: string): Promise<MedicamentoResponse> {
    try {
      const response = await api.get(`/medicamentos/buscar?nombre=${encodeURIComponent(nombre)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener por estado
  async getByEstado(estado: string): Promise<MedicamentoResponse> {
    try {
      const response = await api.get(`/medicamentos/estado/${estado}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener próximos a caducar
  async getProximosCaducar(): Promise<MedicamentoResponse> {
    try {
      const response = await api.get('/medicamentos/proximos-caducar');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener stock bajo
  async getStockBajo(): Promise<MedicamentoResponse> {
    try {
      const response = await api.get('/medicamentos/stock-bajo');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener estadísticas
  async getEstadisticas(): Promise<MedicamentoResponse> {
    try {
      const response = await api.get('/medicamentos/estadisticas');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // En medicamentoService.ts, reemplaza el método getCategorias() por:

    // Obtener categorías desde el backend
    async getCategorias(): Promise<Categoria[]> {
    try {
        const response = await api.get('/categorias');
        if (response.data.success) {
        return response.data.categorias || [];
        }
        return [];
    } catch (error) {
        console.error('Error cargando categorías:', error);
        // Fallback a datos simulados si el endpoint no existe aún
        return [
        { categoriaId: 1, categoriaNom: 'ANALGÉSICOS', categoriaDesc: 'Medicamentos para el dolor' },
        { categoriaId: 2, categoriaNom: 'ANTIBIÓTICOS', categoriaDesc: 'Medicamentos antibacterianos' },
        { categoriaId: 3, categoriaNom: 'ANTIINFLAMATORIOS', categoriaDesc: 'Reducen inflamación' },
        { categoriaId: 4, categoriaNom: 'ANTIPIRÉTICOS', categoriaDesc: 'Bajan la fiebre' },
        { categoriaId: 5, categoriaNom: 'ANTIHISTAMÍNICOS', categoriaDesc: 'Para alergias' },
        { categoriaId: 6, categoriaNom: 'VACUNAS', categoriaDesc: 'Inmunizaciones' },
        ];
    }
    },

  // Helper: Formatear fecha para input date
  formatDateForInput(dateString: string | null): string {
    if (!dateString) return '';
    return dateString.split('T')[0];
  },

  // Helper: Calcular días para caducar
  calcularDiasParaCaducar(fechaCaducidad: string | null): number {
    if (!fechaCaducidad) return 0;
    const hoy = new Date();
    const caducidad = new Date(fechaCaducidad);
    const diffTime = caducidad.getTime() - hoy.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Helper: Obtener clase CSS para estado
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return 'badge bg-success';
      case 'AGOTADO': return 'badge bg-danger';
      case 'CADUCADO': return 'badge bg-warning text-dark';
      case 'RESERVADO': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  },

  // Helper: Obtener texto para estado
  getEstadoText(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return 'Disponible';
      case 'AGOTADO': return 'Agotado';
      case 'CADUCADO': return 'Caducado';
      case 'RESERVADO': return 'Reservado';
      default: return estado;
    }
  }
};
