import { ExportButton } from "@/components/export-button"
import { ErrorState } from "@/components/error-state"
import { RegistrosTable } from "@/components/registros-table"
import { SearchBar } from "@/components/search-bar"
import { SearchFilters } from "@/components/search-filters"
import { getRegistros } from "@/lib/api"
import type { Registro } from "@/lib/types"

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BuscarPage({ searchParams }: Props) {
  const params = await searchParams
  const filtros: Record<string, string> = {}
  for (const [key, value] of Object.entries(params)) if (typeof value === "string" && value.trim()) filtros[key] = value

  let registros: Registro[] = []
  let error: string | null = null
  try {
    registros = await getRegistros(filtros)
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Error desconocido"
  }

  return <div className="container mx-auto px-4 py-10"><div className="mb-8"><h1 className="mb-4 text-3xl font-bold">Buscar</h1><SearchBar defaultValue={filtros.q || ""} /></div><div className="grid gap-8 lg:grid-cols-[280px_1fr]"><aside className="hidden lg:block"><SearchFilters valores={filtros} /></aside><main className="min-w-0"><div className="mb-6 flex items-center justify-between"><p className="text-sm text-muted-foreground">{registros.length} resultado{registros.length !== 1 ? "s" : ""}</p><ExportButton filtros={filtros} /></div>{error ? <ErrorState mensaje={error} /> : <RegistrosTable registros={registros} />}</main></div></div>
}