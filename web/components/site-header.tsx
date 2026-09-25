"use client"

import { Lock, Menu, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "./theme-toggle"

const navLinks: { href: string; label: string; icon?: typeof Lock }[] = [
  { href: "/", label: "Inicio" },
  { href: "/buscar", label: "Buscar" },
  { href: "/estadisticas", label: "Estadísticas" },
  { href: "/admin", label: "Panel Admin", icon: Lock },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold"><Search className="h-5 w-5" /><span>Catálogo Académico</span></Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => { const Icon = link.icon; return <Link key={link.href} href={link.href} className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">{Icon && <Icon className="h-3.5 w-3.5" />}{link.label}</Link> })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú" />}><Menu className="h-5 w-5" /></SheetTrigger>
            <SheetContent side="right"><nav className="mt-8 flex flex-col gap-4 px-4">{navLinks.map((link) => { const Icon = link.icon; return <Link key={link.href} href={link.href} className="flex items-center gap-2 text-lg font-medium">{Icon && <Icon className="h-4 w-4" />}{link.label}</Link> })}</nav></SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}