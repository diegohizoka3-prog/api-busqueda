"use client"

import { Pencil, Trash2 } from "lucide-react"
import type { Registro } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface Props {
  registros: Registro[]
  onEdit: (registro: Registro) => void
  onDelete: (registro: Registro) => void
}

const valor = (value?: string) => value?.trim() || "—"

export function AdminRecordsTable({ registros, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full min-w-[1200px] text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-100">
          <tr>
            {["ID", "AULA", "HORARIO", "PROGRAMA", "MODALIDAD", "SEMESTRE", "CORTE", "MÓDULO", "NOMBRE DEL MÓDULO", "DOCENTE", "ACCIONES"].map((heading) => (
              <th key={heading} className="whitespace-nowrap px-4 py-3 text-left font-semibold text-neutral-900">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 bg-white">
          {registros.map((registro) => (
            <tr key={registro.id} className="transition-colors hover:bg-neutral-50">
              <td className="px-4 py-3 text-neutral-900">{registro.id}</td>
              <td className="px-4 py-3 text-neutral-900">{valor(registro.salon)}</td>
              <td className="px-4 py-3 text-neutral-900">{valor(registro.horarioClase)}</td>
              <td className="px-4 py-3 text-neutral-900">{valor(registro.carrera)}</td>
              <td className="px-4 py-3 text-neutral-900">{valor(registro.modalidad)}</td>
              <td className="px-4 py-3 text-neutral-900">{valor(registro.semestre)}</td>
              <td className="px-4 py-3 text-neutral-900">{valor(registro.corte)}</td>
              <td className="px-4 py-3 text-neutral-900">{valor(registro.modulo)}</td>
              <td className="max-w-xs truncate px-4 py-3 text-neutral-900" title={valor(registro.nombreModulo)}>{valor(registro.nombreModulo)}</td>
              <td className="px-4 py-3 text-neutral-900">{valor(registro.profesor)}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(registro)} className="text-blue-600 hover:text-blue-700" title="Editar" aria-label={`Editar ${registro.id}`}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(registro)} className="text-red-600 hover:text-red-700" title="Eliminar" aria-label={`Eliminar ${registro.id}`}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {registros.length === 0 && <div className="bg-white p-12 text-center text-sm text-neutral-600">No hay registros que coincidan.</div>}
    </div>
  )
}
