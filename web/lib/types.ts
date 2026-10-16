export interface Registro {
  id: number
  salon: string
  horarioClase: string
  carrera: string
  modalidad: string
  semestre?: string
  corte?: string
  modulo: string
  nombreModulo: string
}

export interface Estadisticas {
  totalRegistros: number
  totalAulas: number
  totalProgramas: number
  totalModulos: number
  distribucion?: Record<string, Record<string, number>>
}