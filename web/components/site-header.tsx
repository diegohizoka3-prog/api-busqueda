"use client"

import { Menu, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "./theme-toggle"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/buscar", label: "Buscar" },
  { href: "/estadisticas", label: "Estadísticas" },
  { href: "/about", label: "About" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold"><Search className="h-5 w-5" /><span>Catálogo Académico</span></Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => <Link key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{link.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" render={<a href="https://github.com/diegohizoka3-prog/api-busqueda" target="_blank" rel="noopener noreferrer" aria-label="GitHub" />}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.19a11.05 11.05 0 0 1 5.79 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.13v3.16c0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            <span className="sr-only">GitHub</span>
          </Button>
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú" />}><Menu className="h-5 w-5" /></SheetTrigger>
            <SheetContent side="right"><nav className="mt-8 flex flex-col gap-4 px-4">{navLinks.map((link) => <Link key={link.href} href={link.href} className="text-lg font-medium">{link.label}</Link>)}</nav></SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}