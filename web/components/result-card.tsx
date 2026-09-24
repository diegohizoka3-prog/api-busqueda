import { Building2, Clock, User } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Registro } from "@/lib/types"

export function ResultCard({ registro }: { registro: Registro }) {
  return <Link href={`/registros/${registro.id}`}><Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-md"><CardContent className="p-6"><Badge variant="secondary" className="mb-3">{registro.carrera}</Badge><h3 className="mb-1 text-lg font-semibold">{registro.nombreModulo}</h3><p className="mb-4 text-sm text-muted-foreground">{registro.modulo}</p><div className="space-y-2 text-sm text-muted-foreground"><div className="flex items-center gap-2"><User className="h-4 w-4" /><span>{registro.profesor}</span></div><div className="flex items-center gap-2"><Building2 className="h-4 w-4" /><span>{registro.salon}</span></div><div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{registro.horarioClase}</span></div></div></CardContent></Card></Link>
}