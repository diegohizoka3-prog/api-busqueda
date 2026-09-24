"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) params.set("q", query.trim())
    else params.delete("q")
    router.push(`/buscar?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl gap-2">
      <div className="relative flex-1"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar..." className="pl-10" /></div>
      <Button type="submit">Buscar</Button>
    </form>
  )
}