"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const CAMPOS = [
  { key: "salon", label: "Salón" },
  { key: "profesor", label: "Profesor" },
  { key: "carrera", label: "Carrera" },
  { key: "modulo", label: "Módulo" },
  { key: "horarioClase", label: "Horario" },
  { key: "nombreModulo", label: "Nombre del módulo" },
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
      {CAMPOS.map(({ key, label }) => <div key={key} className="space-y-2"><Label htmlFor={key} className="text-sm">{label}</Label><Input id={key} value={local[key] || ""} onChange={(event) => setLocal({ ...local, [key]: event.target.value })} placeholder={`Filtrar por ${label.toLowerCase()}`} /></div>)}
      <Button className="w-full" onClick={aplicar}>Aplicar filtros</Button>
    </div>
  )
}