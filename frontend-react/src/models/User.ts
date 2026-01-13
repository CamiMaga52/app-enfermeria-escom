export interface UserData {
  id: number;
  nombre: string;
  nombreCompleto: string;
  correo: string;
  rol: string;
  rolId: number;
  activo: boolean;
  fechaRegistro?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  timestamp: string;
  user: UserData;
}
