export interface Paciente {
  pacienteId: number;
  pacienteNombre: string;
  pacienteEscuela: string;
  pacienteEdad: number;
  pacienteTelefono: string;
  pacienteEmail: string;
  created_at?: string;
}

export interface PacienteFormData {
  pacienteNombre: string;
  pacienteEscuela: string;
  pacienteEdad: number;
  pacienteTelefono: string;
  pacienteEmail: string;
}

export interface PacienteResponse {
  success: boolean;
  message: string;
  paciente?: Paciente;
  pacientes?: Paciente[];
  total?: number;
  totalPacientes?: number;
}
