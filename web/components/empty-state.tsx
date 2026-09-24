import { SearchX } from "lucide-react"

export function EmptyState() {
  return <div className="py-20 text-center"><SearchX className="mx-auto mb-4 h-16 w-16 text-muted-foreground" /><h3 className="mb-2 text-xl font-semibold">Sin resultados</h3><p className="text-muted-foreground">Intenta con otros términos o limpia los filtros.</p></div>
}