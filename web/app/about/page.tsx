import { BookOpen, Database, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const stack = ["Next.js 15", "TypeScript", "Tailwind CSS", "shadcn/ui", "Node.js", "Express", "PostgreSQL", "Vercel"]

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-4 text-4xl font-bold">Acerca de</h1>
      <p className="mb-8 text-lg text-muted-foreground">Catálogo Académico es una plataforma de búsqueda académica que permite consultar información sobre salones, profesores, carreras y módulos de forma instantánea.</p>
      <Card className="mb-6"><CardContent className="p-6"><h2 className="mb-4 font-semibold">Stack técnico</h2><div className="flex flex-wrap gap-2">{stack.map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}</div></CardContent></Card>
      <div className="flex flex-wrap gap-3">
        <Button render={<Link href="/api/v1/docs" target="_blank" />}><BookOpen className="mr-2 h-4 w-4" />API Docs</Button>
        <Button variant="outline" render={<a href="https://github.com/diegohizoka3-prog/api-busqueda" target="_blank" rel="noopener noreferrer" />}>GitHub</Button>
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><Database className="h-4 w-4" />Vercel <ExternalLink className="h-3 w-3" /></a>
      </div>
    </div>
  )
}
