import Link from "next/link"
import { EmptyState } from "@/components/empty-state"
import type { Registro } from "@/lib/types"

interface Props {
  registros: Registro[]
}

const valor = (value?: string) => value?.trim() || "—"

export function RegistrosTable({ registros }: Props) {
  if (registros.length === 0) return <EmptyState />

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 bg-muted/50">
            <tr>
              {['AULA', 'HORARIO', 'PROGRAMA', 'SEMESTRE', 'CORTE #', 'MÓDULO', 'NOMBRE DEL MÓDULO', 'DOCENTE'].map((heading) => (
                <th key={heading} className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase ${heading === 'SEMESTRE' || heading === 'CORTE #' || heading === 'MÓDULO' ? 'text-center' : ''}`}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registros.map((registro) => (
              <tr key={registro.id} className="border-b transition-colors last:border-0 hover:bg-muted/30">
                <td data-label="AULA" className="px-4 py-3 text-sm"><Link className="hover:underline" href={`/registros/${registro.id}`}>{valor(registro.salon)}</Link></td>
                <td data-label="HORARIO" className="px-4 py-3 text-sm">{valor(registro.horarioClase)}</td>
                <td data-label="PROGRAMA" className="px-4 py-3 text-sm">{valor(registro.carrera)}</td>
                <td data-label="SEMESTRE" className="px-4 py-3 text-center text-sm">{valor(registro.semestre)}</td>
                <td data-label="CORTE #" className="px-4 py-3 text-center text-sm">{valor(registro.corte)}</td>
                <td data-label="MÓDULO" className="px-4 py-3 text-center text-sm">{valor(registro.modulo)}</td>
                <td data-label="NOMBRE DEL MÓDULO" className="max-w-md truncate px-4 py-3 text-sm" title={valor(registro.nombreModulo)}>{valor(registro.nombreModulo)}</td>
                <td data-label="DOCENTE" className="px-4 py-3 text-sm">{valor(registro.profesor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
