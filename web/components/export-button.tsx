"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { exportarExcelURL } from "@/lib/api"

export function ExportButton({ filtros }: { filtros: Record<string, string> }) {
  return <Button variant="outline" size="sm" render={<a href={exportarExcelURL(filtros)} download />}><Download className="mr-2 h-4 w-4" />Exportar Excel</Button>
}
