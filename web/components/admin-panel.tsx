"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { Download, FileSpreadsheet, LogOut, Plus, Search, ShieldCheck, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Registro } from "@/lib/types"
import { actualizarRegistro, crearRegistro, eliminarRegistro, getAdminRegistros, getMe, importarRegistros, logout } from "@/lib/auth"
import { exportarExcelURL } from "@/lib/api"
import { AdminRecordsTable } from "@/components/admin-records-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const campos = [
  ["salon", "Salón"], ["horarioClase", "Horario"], ["carrera", "Carrera"], ["modalidad", "Modalidad"],
  ["semestre", "Semestre"], ["corte", "Corte"], ["modulo", "Módulo"], ["codigoModulo", "Código del módulo"],
  ["nombreModulo", "Nombre del módulo"], ["profesor", "Profesor"],
] as const

type RegistroForm = Omit<Registro, "id">

const emptyForm: RegistroForm = {
  salon: "", horarioClase: "", carrera: "", modalidad: "", semestre: "", corte: "", modulo: "", codigoModulo: "", nombreModulo: "", profesor: "",
}

function formFromRegistro(registro: Registro): RegistroForm {
  return Object.fromEntries(campos.map(([key]) => [key, registro[key] || ""])) as RegistroForm
}

export function AdminPanel() {
  const router = useRouter()
  const [registros, setRegistros] = useState<Registro[]>([])
  const [usuario, setUsuario] = useState("")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editing, setEditing] = useState<Registro | null>(null)
  const [form, setForm] = useState<RegistroForm>(emptyForm)
  const [file, setFile] = useState<File | null>(null)

  async function load() {
    const [me, data] = await Promise.all([getMe(), getAdminRegistros()])
    setUsuario(me.user)
    setRegistros(data)
  }

  useEffect(() => {
    load().catch(() => router.replace("/admin/login")).finally(() => setLoading(false))
  }, [router])

  const visibles = registros.filter((registro) => Object.values(registro).join(" ").toLowerCase().includes(query.trim().toLowerCase()))

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  function openEdit(registro: Registro) {
    setEditing(registro)
    setForm(formFromRegistro(registro))
    setFormOpen(true)
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    try {
      if (editing) await actualizarRegistro(editing.id, form)
      else await crearRegistro(form)
      await load()
      setFormOpen(false)
      toast.success(editing ? "Registro actualizado" : "Registro creado")
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "No se pudo guardar")
    } finally {
      setSaving(false)
    }
  }

  async function remove(registro: Registro) {
    if (!window.confirm(`¿Eliminar el registro ${registro.id}?`)) return
    try {
      await eliminarRegistro(registro.id)
      setRegistros((current) => current.filter((item) => item.id !== registro.id))
      toast.success("Registro eliminado")
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "No se pudo eliminar")
    }
  }

  async function importFile() {
    if (!file) return
    setSaving(true)
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: "" })
      const data = rows.map((row) => Object.fromEntries(campos.map(([key]) => [key, String(row[key] ?? "")])) as RegistroForm)
      const result = await importarRegistros(data)
      await load()
      setImportOpen(false)
      setFile(null)
      toast.success(`${result.importados} registros importados`)
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "No se pudo importar el archivo")
    } finally {
      setSaving(false)
    }
  }

  async function signOut() {
    await logout().catch(() => undefined)
    router.replace("/admin/login")
  }

  if (loading) return <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-slate-50"><p className="text-sm text-muted-foreground">Cargando administración...</p></main>

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-lg shadow-slate-300/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3"><div className="rounded-lg bg-white/10 p-2"><ShieldCheck className="size-5" /></div><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Panel privado</p><h1 className="mt-1 text-2xl font-semibold">Gestión de registros</h1><p className="mt-1 text-sm text-slate-300">Administra el catálogo académico sin editar código.</p></div></div>
          <div className="flex items-center gap-3"><Badge className="border-white/20 bg-white/10 text-white">{usuario}</Badge><Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={signOut}><LogOut className="mr-2 size-4" />Cerrar sesión</Button></div>
        </header>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="gap-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Registros académicos</CardTitle><CardDescription>{visibles.length} visibles de {registros.length} registros</CardDescription></div><div className="flex flex-wrap gap-2"><Button onClick={openCreate}><Plus className="mr-2 size-4" />Crear registro</Button><Button variant="outline" onClick={() => setImportOpen(true)}><Upload className="mr-2 size-4" />Importar Excel</Button><a className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-input bg-transparent px-3 text-sm font-medium whitespace-nowrap transition-colors hover:bg-accent hover:text-accent-foreground" href={exportarExcelURL()} download><Download className="size-4" />Exportar</a></div></CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6"><div className="relative max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar registros..." /></div><AdminRecordsTable registros={visibles} onEdit={openEdit} onDelete={remove} /></CardContent>
        </Card>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>{editing ? "Editar registro" : "Crear registro"}</DialogTitle><DialogDescription>Completa la información del registro académico.</DialogDescription></DialogHeader><form onSubmit={save} className="grid max-h-[65vh] gap-4 overflow-y-auto py-2 sm:grid-cols-2">{campos.map(([key, label]) => <div className="space-y-2" key={key}><Label htmlFor={`admin-${key}`}>{label}</Label><Input id={`admin-${key}`} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required={key === "salon" || key === "carrera" || key === "horarioClase" || key === "nombreModulo"} /></div>)}<DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button><Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar registro"}</Button></DialogFooter></form></DialogContent></Dialog>

      <Dialog open={importOpen} onOpenChange={setImportOpen}><DialogContent><DialogHeader><DialogTitle>Importar Excel</DialogTitle><DialogDescription>Sube un archivo .xlsx, .xls o .json con los encabezados del catálogo.</DialogDescription></DialogHeader><div className="space-y-4"><div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center"><FileSpreadsheet className="mx-auto mb-3 size-8 text-slate-500" /><Input className="mx-auto max-w-sm bg-white" type="file" accept=".xlsx,.xls,.json" onChange={(event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0] || null)} />{file && <p className="mt-3 text-sm text-slate-600">{file.name}</p>}</div><DialogFooter><Button type="button" variant="outline" onClick={() => setImportOpen(false)}><X className="mr-2 size-4" />Cancelar</Button><Button type="button" disabled={!file || saving} onClick={importFile}>{saving ? "Importando..." : <><Upload className="mr-2 size-4" />Importar archivo</>}</Button></DialogFooter></div></DialogContent></Dialog>
    </main>
  )
}
