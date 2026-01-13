import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface OpcionesFiltro {
  meses: string[];
  años: number[];
  mesActual: number;
  añoActual: number;
}

export interface EstadisticasReporte {
  medicamentos: number;
  materiales: number;
  recetas: number;
  pacientes: number;
  stockBajo: number;
  proximosCaducar: number;
}

class ReporteService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'X-User-Id': userId || '1'
    };
  }

  // Obtener opciones de filtro
  async obtenerOpcionesFiltro(): Promise<OpcionesFiltro> {
    const response = await axios.get(`${API_URL}/reportes/opciones-filtro`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  // Obtener estadísticas para vista previa
  async obtenerEstadisticas(mes?: number, año?: number): Promise<{estadisticas: EstadisticasReporte, periodo: string}> {
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes.toString());
    if (año) params.append('año', año.toString());
    
    const response = await axios.get(`${API_URL}/reportes/estadisticas?${params.toString()}`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  // Descargar reporte de medicamentos
  async descargarReporteMedicamentos(mes?: number, año?: number): Promise<void> {
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes.toString());
    if (año) params.append('año', año.toString());
    
    const response = await axios.get(`${API_URL}/reportes/medicamentos/pdf?${params.toString()}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
    
    this.descargarPDF(response.data, 'reporte-medicamentos.pdf');
  }

  // Descargar reporte de materiales
  async descargarReporteMateriales(mes?: number, año?: number): Promise<void> {
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes.toString());
    if (año) params.append('año', año.toString());
    
    const response = await axios.get(`${API_URL}/reportes/materiales/pdf?${params.toString()}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
    
    this.descargarPDF(response.data, 'reporte-materiales.pdf');
  }

  // Descargar reporte de recetas
  async descargarReporteRecetas(mes?: number, año?: number): Promise<void> {
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes.toString());
    if (año) params.append('año', año.toString());
    
    const response = await axios.get(`${API_URL}/reportes/recetas/pdf?${params.toString()}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
    
    this.descargarPDF(response.data, 'reporte-recetas.pdf');
  }

  // Descargar reporte consolidado
  async descargarReporteConsolidado(mes?: number, año?: number): Promise<void> {
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes.toString());
    if (año) params.append('año', año.toString());
    
    const response = await axios.get(`${API_URL}/reportes/consolidado/pdf?${params.toString()}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
    
    this.descargarPDF(response.data, 'reporte-consolidado.pdf');
  }

  // Método auxiliar para descargar archivos PDF
  private descargarPDF(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const reporteService = new ReporteService();
