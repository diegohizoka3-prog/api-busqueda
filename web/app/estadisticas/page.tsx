import { Building2, Database, GraduationCap, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getEstadisticas } from "@/lib/api"

export const revalidate = 60

export default async function EstadisticasPage() {
  let stats = { totalRegistros: 0, totalSalones: 0, totalProfesores: 0, totalCarreras: 0 }
  try { stats = await getEstadisticas() } catch { /* La API puede estar apagada en desarrollo. */ }
  const cards = [{ icon: Database, label: "Registros totales", value: stats.totalRegistros, color: "text-blue-500" }, { icon: Building2, label: "Salones", value: stats.totalSalones, color: "text-green-500" }, { icon: Users, label: "Profesores", value: stats.totalProfesores, color: "text-purple-500" }, { icon: GraduationCap, label: "Carreras", value: stats.totalCarreras, color: "text-orange-500" }]
  return <div className="container mx-auto px-4 py-10"><h1 className="mb-2 text-3xl font-bold">Estadísticas</h1><p className="mb-8 text-muted-foreground">Resumen general de los datos académicos.</p><div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">{cards.map((card) => <Card key={card.label}><CardContent className="p-6"><card.icon className={`mb-3 h-6 w-6 ${card.color}`} /><div className="text-3xl font-bold">{card.value}</div><div className="text-sm text-muted-foreground">{card.label}</div></CardContent></Card>)}</div></div>
}