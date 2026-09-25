"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CAMPOS = [
  { key: "salon", label: "Salón" },
  { key: "profesor", label: "Profesor" },
  { key: "carrera", label: "Carrera" },
  { key: "modalidad", label: "Modalidad" },
  { key: "modulo", label: "Módulo" },
  { key: "horarioClase", label: "Horario" },
  { key: "semestre", label: "Semestre" },
  { key: "corte", label: "Corte" },
]

export function SearchFilters({ valores }: { valores: Record<string, string> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [local, setLocal] = useState(valores)

  useEffect(() => setLocal(valores), [valores])

  function aplicar() {
    const params = new URLSearchParams(searchParams.toString())
    for (const { key } of CAMPOS) {
      if (local[key]?.trim()) params.set(key, local[key])
      else params.delete(key)
    }
    router.push(`/buscar?${params.toString()}`)
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between"><h3 className="font-semibold">Filtros</h3><Button variant="ghost" size="sm" onClick={() => router.push("/buscar")}>Limpiar</Button></div>
      {CAMPOS.map(({ key, label }) => <div key={key} className="space-y-2"><Label htmlFor={key} className="text-sm">{label}</Label>{key === "modalidad" ? <Select value={local[key] || "__empty__"} onValueChange={(value) => setLocal({ ...local, [key]: value === "__empty__" ? "" : value || "" })}><SelectTrigger id={key} className="w-full"><SelectValue placeholder="Seleccionar modalidad" /></SelectTrigger><SelectContent><SelectItem value="__empty__">(vacío)</SelectItem><SelectItem value="Presencial">Presencial</SelectItem><SelectItem value="Intensiva">Intensiva</SelectItem><SelectItem value="Semipresencial">Semipresencial</SelectItem><SelectItem value="Nocturna">Nocturna</SelectItem></SelectContent></Select> : <Input id={key} value={local[key] || ""} onChange={(event) => setLocal({ ...local, [key]: event.target.value })} placeholder={`Filtrar por ${label.toLowerCase()}`} />}</div>)}
      <Button className="w-full" onClick={aplicar}>Aplicar filtros</Button>
    </div>
  )
}