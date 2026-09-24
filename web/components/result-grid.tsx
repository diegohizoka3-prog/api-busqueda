"use client"

import { useState } from "react"
import { EmptyState } from "./empty-state"
import { Pagination } from "./pagination"
import { ResultCard } from "./result-card"
import type { Registro } from "@/lib/types"

const POR_PAGINA = 12

export function ResultGrid({ registros }: { registros: Registro[] }) {
  const [pagina, setPagina] = useState(1)
  if (registros.length === 0) return <EmptyState />
  const totalPaginas = Math.ceil(registros.length / POR_PAGINA)
  const paginados = registros.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)
  return <div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{paginados.map((registro) => <ResultCard key={registro.id} registro={registro} />)}</div><Pagination pagina={pagina} totalPaginas={totalPaginas} onChange={setPagina} /></div>
}