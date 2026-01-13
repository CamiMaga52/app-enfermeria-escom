export interface Receta {
  recetaId: number;
  recetaFolio: string;
  recetaFecha: string;
  recetaDiag: string;
  recetaObs: string;
  recetaEstado: 'ACTIVA' | 'COMPLETADA' | 'CANCELADA';
  pacienteId: number;
  usuarioId: number;
  pacienteNombre?: string;
  usuarioNombre?: string;
  created_at?: string;
}

export interface DetalleReceta {
  detRecetaId: number;
  detRecetaMed: string;
  detRecetaCant: number;
  detRecetaDosis: string;
  detRecetaDur: string;
  detRecetaIndicaciones: string;
  recetaId: number;
  medicamentoId: number | null;
  medicamentoNombre?: string;
  created_at?: string;
}

export interface RecetaCompleta {
  receta: Receta;
  detalles: DetalleReceta[];
}

export interface RecetaFormData {
  recetaDiag: string;
  recetaObs: string;
  pacienteId: number;
  detalles: DetalleRecetaFormData[];
}

export interface DetalleRecetaFormData {
  detRecetaMed: string;
  detRecetaCant: number;
  detRecetaDosis: string;
  detRecetaDur: string;
  detRecetaIndicaciones: string;
  medicamentoId: number | null;
}

export interface RecetaResponse {
  success: boolean;
  message: string;
  receta?: Receta;
  recetas?: Receta[];
  recetaCompleta?: RecetaCompleta;
  total?: number;
  totalRecetas?: number;
  activas?: number;
  completadas?: number;
}
