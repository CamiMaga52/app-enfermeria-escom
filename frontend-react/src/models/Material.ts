export interface Material {
  materialId: number;
  materialNom: string;
  materialDesc: string;
  materialFecComp: string | null;
  materialEstado: 'DISPONIBLE' | 'AGOTADO' | 'DESGASTADO' | 'MANTENIMIENTO';
  materialStock: number;
  materialStockMin: number;
  materialPrecio: number;
  categoriaId: number;
  categoriaNombre: string;
  created_at?: string;
  updated_at?: string;
}

export interface MaterialFormData {
  materialNom: string;
  materialDesc: string;
  materialFecComp: string;
  materialEstado: string;
  materialStock: number;
  materialStockMin: number;
  materialPrecio: number;
  categoriaId: number;
}

export interface MaterialResponse {
  success: boolean;
  message: string;
  material?: Material;
  materiales?: Material[];
  total?: number;
  totalMateriales?: number;
  stockBajo?: number;
  enMantenimiento?: number;
}
