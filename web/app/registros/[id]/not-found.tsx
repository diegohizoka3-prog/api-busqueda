import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return <div className="container mx-auto px-4 py-20 text-center"><h1 className="mb-4 text-4xl font-bold">Registro no encontrado</h1><p className="mb-6 text-muted-foreground">El registro que buscas no existe.</p><Button render={<Link href="/buscar" />}>Volver a buscar</Button></div>
}