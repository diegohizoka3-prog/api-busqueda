"use client"

export function Pagination({ pagina, totalPaginas, onChange }: { pagina: number; totalPaginas: number; onChange: (pagina: number) => void }) {
  if (totalPaginas <= 1) return null
  return <div className="mt-8 flex items-center justify-center gap-2"><button onClick={() => onChange(Math.max(1, pagina - 1))} disabled={pagina === 1} className="rounded border px-4 py-2 disabled:opacity-50">Anterior</button><span className="text-sm text-muted-foreground">Página {pagina} de {totalPaginas}</span><button onClick={() => onChange(Math.min(totalPaginas, pagina + 1))} disabled={pagina === totalPaginas} className="rounded border px-4 py-2 disabled:opacity-50">Siguiente</button></div>
}