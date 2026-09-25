export interface Registro {
  id: number
  salon: string
  profesor: string
  carrera: string
  modulo: string
  horarioClase: string
  nombreModulo: string
  semestre?: string
  corte?: string
  codigoModulo?: string
  modalidad?: string
}

export interface Estadisticas {
  totalRegistros: number
  totalSalones: number
  totalProfesores: number
  totalCarreras: number
  distribucion?: Record<string, Record<string, number>>
}