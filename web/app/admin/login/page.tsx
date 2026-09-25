"use client"

import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LockKeyhole, LogIn, ShieldCheck } from "lucide-react"
import { login, getMe } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getMe().then(() => router.replace("/admin")).catch(() => undefined)
  }, [router])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(usuario, password)
      router.replace("/admin")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md border-slate-200 bg-white shadow-xl shadow-slate-200/60">
        <CardHeader className="space-y-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-slate-900 text-white"><ShieldCheck className="size-6" /></div>
          <div><CardTitle className="text-2xl">Administración</CardTitle><CardDescription>Accede al espacio privado de gestión académica.</CardDescription></div>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={submit}>
            <div className="space-y-2"><Label htmlFor="usuario">Usuario</Label><Input id="usuario" autoComplete="username" value={usuario} onChange={(event) => setUsuario(event.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="password">Contraseña</Label><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div></div>
            {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
            <Button className="w-full" type="submit" disabled={loading}>{loading ? "Validando..." : <><LogIn className="mr-2 size-4" />Iniciar sesión</>}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
