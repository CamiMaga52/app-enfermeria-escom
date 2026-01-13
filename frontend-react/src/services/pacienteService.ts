import api from './api';
import type { Paciente, PacienteFormData, PacienteResponse } from '../models/Paciente';

export const pacienteService = {
  // Obtener todos los pacientes
  async getAll(): Promise<PacienteResponse> {
    try {
      const response = await api.get('/pacientes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener paciente por ID
  async getById(id: number): Promise<PacienteResponse> {
    try {
      const response = await api.get(`/pacientes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo paciente
  async create(data: PacienteFormData): Promise<PacienteResponse> {
    try {
      const response = await api.post('/pacientes', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar paciente
  async update(id: number, data: Partial<PacienteFormData>): Promise<PacienteResponse> {
    try {
      const response = await api.put(`/pacientes/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar paciente
  async delete(id: number): Promise<PacienteResponse> {
    try {
      const response = await api.delete(`/pacientes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar pacientes por nombre o escuela
  async search(termino: string): Promise<PacienteResponse> {
    try {
      const response = await api.get(`/pacientes/buscar?termino=${encodeURIComponent(termino)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar pacientes por escuela
  async getByEscuela(escuela: string): Promise<PacienteResponse> {
    try {
      const response = await api.get(`/pacientes/escuela/${encodeURIComponent(escuela)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener estadísticas
  async getEstadisticas(): Promise<PacienteResponse> {
    try {
      const response = await api.get('/pacientes/estadisticas');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Helper: Validar email
  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Helper: Validar teléfono
  validarTelefono(telefono: string): boolean {
    const regex = /^[0-9+\-\s()]{10,15}$/;
    return regex.test(telefono);
  },

  // Helper: Obtener clase CSS para edad
  getEdadClass(edad: number): string {
    if (edad < 18) return 'edad-joven';
    if (edad >= 18 && edad <= 30) return 'edad-adulto-joven';
    if (edad > 30 && edad <= 50) return 'edad-adulto';
    return 'edad-mayor';
  },

  // Helper: Formatear fecha
    formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};
