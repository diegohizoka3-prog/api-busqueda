"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ErrorState({ mensaje }: { mensaje: string }) {
  return <div className="py-20 text-center"><AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" /><h3 className="mb-2 text-xl font-semibold">Algo salió mal</h3><p className="mb-4 text-muted-foreground">{mensaje}</p><Button onClick={() => window.location.reload()}>Reintentar</Button></div>
}