import { ArrowLeft, BookOpen, Building2, Clock, GraduationCap, Hash, User } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getRegistro } from "@/lib/api"
import type { Registro } from "@/lib/types"

interface Props { params: Promise<{ id: string }> }

export default async function RegistroPage({ params }: Props) {
  const { id } = await params
  let registro: Registro
  try { registro = await getRegistro(id) } catch { notFound() }
  const campos = [{ icon: Hash, label: "ID", value: registro.id }, { icon: GraduationCap, label: "Carrera", value: registro.carrera }, { icon: BookOpen, label: "Módulo", value: registro.modulo }, { icon: BookOpen, label: "Nombre del módulo", value: registro.nombreModulo }, { icon: GraduationCap, label: "Semestre", value: registro.semestre || "—" }, { icon: Hash, label: "Corte", value: registro.corte || "—" }, { icon: Hash, label: "Código del módulo", value: registro.codigoModulo || "—" }, { icon: User, label: "Profesor", value: registro.profesor || "—" }, { icon: Building2, label: "Salón", value: registro.salon }, { icon: Clock, label: "Horario", value: registro.horarioClase }]
  return <div className="container mx-auto max-w-3xl px-4 py-10"><Button variant="ghost" className="mb-6" render={<Link href="/buscar" />}><ArrowLeft className="mr-2 h-4 w-4" />Volver a buscar</Button><div className="mb-6"><Badge variant="secondary" className="mb-3">{registro.carrera}</Badge><h1 className="mb-2 text-3xl font-bold">{registro.nombreModulo}</h1><p className="text-muted-foreground">{registro.modulo}</p></div><Card><CardContent className="space-y-4 p-6">{campos.map(({ icon: Icon, label, value }) => <div key={label} className="flex items-start gap-4 border-b py-3 last:border-0"><Icon className="mt-0.5 h-5 w-5 text-muted-foreground" /><div className="flex-1"><div className="text-sm text-muted-foreground">{label}</div><div className="font-medium">{value}</div></div></div>)}</CardContent></Card></div>
}