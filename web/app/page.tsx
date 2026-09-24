import { ArrowRight, Building2, Database, GraduationCap, Sparkles, Users } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SearchHero } from "@/components/search-hero"
import { RegistrosTable } from "@/components/registros-table"
import { getEstadisticas, getRegistros } from "@/lib/api"

export const revalidate = 60

export default async function Home() {
  let stats = { totalRegistros: 0, totalSalones: 0, totalProfesores: 0, totalCarreras: 0 }
  let registrosCorte: Awaited<ReturnType<typeof getRegistros>> = []

  try {
    stats = await getEstadisticas()
  } catch {
    // La página sigue siendo útil aunque la API aún no esté disponible.
  }

  try {
    registrosCorte = (await getRegistros({ corte: "Corte 6" })).slice(0, 5)
  } catch {
    // La tabla se omite si la API aún no está disponible.
  }

  const statCards = [
    { label: "Registros", value: stats.totalRegistros, icon: Database },
    { label: "Salones", value: stats.totalSalones, icon: Building2 },
    { label: "Profesores", value: stats.totalProfesores, icon: Users },
    { label: "Carreras", value: stats.totalCarreras, icon: GraduationCap },
  ]

  const exploreCards = [
    { href: "/buscar?tipo=profesor", title: "Profesores", description: "Busca por docente y ve sus módulos asignados.", icon: Users },
    { href: "/buscar?tipo=carrera", title: "Carreras", description: "Explora módulos por carrera académica.", icon: GraduationCap },
    { href: "/buscar?tipo=salon", title: "Salones", description: "Consulta los registros de cada salón.", icon: Building2 },
    { href: "/estadisticas", title: "Estadísticas", description: "Visualiza distribuciones y totales.", icon: Database },
  ]

  return (
    <div className="container mx-auto px-4">
      <section className="relative py-20 text-center md:py-32">
        <div className="absolute inset-0 -z-10 overflow-hidden"><div className="absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" /></div>
        <Badge variant="secondary" className="mb-6"><Sparkles className="mr-1 h-3 w-3" />Búsqueda académica</Badge>
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">Encuentra lo que buscas<br /><span className="text-muted-foreground">en segundos</span></h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">Búsqueda instantánea en salones, profesores, carreras y módulos.</p>
        <div className="flex justify-center"><SearchHero /></div>
      </section>

      <section className="py-12"><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{statCards.map((stat) => <Card key={stat.label}><CardContent className="p-6"><stat.icon className="mb-3 h-5 w-5 text-muted-foreground" /><div className="text-3xl font-bold">{stat.value}</div><div className="text-sm text-muted-foreground">{stat.label}</div></CardContent></Card>)}</div></section>

      <section className="py-12">
        <h2 className="mb-6 text-2xl font-semibold">Explora</h2>
        <div className="grid gap-4 md:grid-cols-2">{exploreCards.map((item) => <Link key={item.href} href={item.href}><Card className="h-full transition-colors hover:border-primary/50"><CardContent className="flex items-start gap-4 p-6"><item.icon className="mt-1 h-8 w-8" /><div className="flex-1"><h3 className="mb-1 font-semibold">{item.title}</h3><p className="text-sm text-muted-foreground">{item.description}</p></div><ArrowRight className="h-5 w-5 text-muted-foreground" /></CardContent></Card></Link>)}</div>
      </section>

      <section className="py-12">
        <div className="mb-6 flex items-end justify-between gap-4"><div><h2 className="text-2xl font-semibold">Corte 6</h2><p className="text-sm text-muted-foreground">Registros recientes del corte académico.</p></div><Link className="text-sm font-medium hover:underline" href="/buscar?corte=Corte+6">Ver todos</Link></div>
        <RegistrosTable registros={registrosCorte} />
      </section>

      <section className="py-20"><Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"><CardContent className="p-12 text-center"><h2 className="mb-4 text-3xl font-bold">¿Listo para buscar?</h2><p className="mx-auto mb-6 max-w-lg text-muted-foreground">Accede a la búsqueda completa con filtros avanzados.</p><Link href="/buscar" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90">Ir a buscar <ArrowRight className="h-4 w-4" /></Link></CardContent></Card></section>
    </div>
  )
}
