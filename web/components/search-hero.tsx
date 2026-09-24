"use client"

import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchHero() {
  const [q, setQ] = useState("")
  const router = useRouter()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (q.trim()) router.push(`/buscar?q=${encodeURIComponent(q.trim())}`)
  }

  return <form onSubmit={handleSubmit} className="flex w-full max-w-2xl gap-2"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Busca por módulo, profesor, carrera..." className="h-14 pl-12 text-lg" /></div><Button type="submit" size="lg" className="h-14 px-8">Buscar</Button></form>
}