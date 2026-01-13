import api from './api';
import type { Material, MaterialFormData, MaterialResponse } from '../models/Material';

export const materialService = {
  // Obtener todos los materiales
  async getAll(): Promise<MaterialResponse> {
    try {
      const response = await api.get('/materiales');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener material por ID
  async getById(id: number): Promise<MaterialResponse> {
    try {
      const response = await api.get(`/materiales/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo material
  async create(data: MaterialFormData): Promise<MaterialResponse> {
    try {
      const response = await api.post('/materiales', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar material
  async update(id: number, data: Partial<MaterialFormData>): Promise<MaterialResponse> {
    try {
      const response = await api.put(`/materiales/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar material
  async delete(id: number): Promise<MaterialResponse> {
    try {
      const response = await api.delete(`/materiales/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar materiales por nombre
  async search(nombre: string): Promise<MaterialResponse> {
    try {
      const response = await api.get(`/materiales/buscar?nombre=${encodeURIComponent(nombre)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener por estado
  async getByEstado(estado: string): Promise<MaterialResponse> {
    try {
      const response = await api.get(`/materiales/estado/${estado}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener materiales con stock bajo
  async getStockBajo(): Promise<MaterialResponse> {
    try {
      const response = await api.get('/materiales/stock-bajo');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener materiales en mantenimiento
  async getEnMantenimiento(): Promise<MaterialResponse> {
    try {
      const response = await api.get('/materiales/mantenimiento');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener estadísticas
  async getEstadisticas(): Promise<MaterialResponse> {
    try {
      const response = await api.get('/materiales/estadisticas');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Helper: Formatear fecha para input date
  formatDateForInput(dateString: string | null): string {
    if (!dateString) return '';
    return dateString.split('T')[0];
  },

  // Helper: Obtener clase CSS para estado
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return 'badge bg-success';
      case 'AGOTADO': return 'badge bg-danger';
      case 'DESGASTADO': return 'badge bg-warning text-dark';
      case 'MANTENIMIENTO': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  },

  // Helper: Obtener texto para estado
  getEstadoText(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return 'Disponible';
      case 'AGOTADO': return 'Agotado';
      case 'DESGASTADO': return 'Desgastado';
      case 'MANTENIMIENTO': return 'En Mantenimiento';
      default: return estado;
    }
  },

  // Helper: Obtener clase CSS para estado de stock
  getStockStatusClass(stock: number, stockMin: number): string {
    if (stock === 0) return 'stock-agotado';
    if (stock <= stockMin) return 'stock-bajo';
    return 'stock-normal';
  }
};
