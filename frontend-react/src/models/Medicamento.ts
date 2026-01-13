export interface Medicamento {
  medicamentoId: number;
  medicamentoNom: string;
  medicamentoDesc: string;
  medicamentoFecComp: string | null;
  medicamentoFecCad: string | null;
  medicamentoLote: string;
  medicamentoLaboratorio: string;
  medicamentoEstado: 'DISPONIBLE' | 'AGOTADO' | 'CADUCADO' | 'RESERVADO';
  medicamentoStock: number;
  medicamentoStockMin: number;
  medicamentoPrecio: number;
  categoriaId: number;
  categoriaNombre: string;
  created_at?: string;
  updated_at?: string;
}

export interface Categoria {
  categoriaId: number;
  categoriaNom: string;
  categoriaDesc: string;
}

export interface MedicamentoFormData {
  medicamentoNom: string;
  medicamentoDesc: string;
  medicamentoFecComp: string;
  medicamentoFecCad: string;
  medicamentoLote: string;
  medicamentoLaboratorio: string;
  medicamentoEstado: string;
  medicamentoStock: number;
  medicamentoStockMin: number;
  medicamentoPrecio: number;
  categoriaId: number;
}

export interface MedicamentoResponse {
  success: boolean;
  message: string;
  medicamento?: Medicamento;
  medicamentos?: Medicamento[];
  total?: number;
  totalMedicamentos?: number;
  stockBajo?: number;
  proximosCaducar?: number;
}
