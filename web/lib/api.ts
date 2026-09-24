import type { Estadisticas, Registro } from "./types"

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000").replace(/\/$/, "")

export async function getEstadisticas(): Promise<Estadisticas> {
  const res = await fetch(`${API_URL}/api/v1/estadisticas`, { cache: "no-store" })
  if (!res.ok) throw new Error("Error al cargar estadísticas")
  return res.json()
}

export async function getRegistros(filtros: Record<string, string> = {}): Promise<Registro[]> {
  const params = new URLSearchParams(filtros)
  const res = await fetch(`${API_URL}/api/v1/buscar?${params}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Error al buscar registros")
  return res.json()
}

export async function getRegistro(id: string): Promise<Registro> {
  const res = await fetch(`${API_URL}/api/v1/registros/${id}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Registro no encontrado")
  return res.json()
}

export function exportarExcelURL(filtros: Record<string, string> = {}) {
  const params = new URLSearchParams(filtros)
  return `${API_URL}/api/v1/exportar-excel?${params}`
}

export { API_URL }