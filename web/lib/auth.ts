'use client'

import type { Registro } from './types'
import { API_URL } from './api'

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, { ...options, credentials: 'include' })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || 'Error de autenticación')
  }
  return response.json()
}

export function login(usuario: string, password: string) {
  return request('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password }),
  })
}

export function logout() {
  return request('/api/v1/auth/logout', { method: 'POST' })
}

export function getMe() {
  return request('/api/v1/auth/me')
}

export function getAdminRegistros(): Promise<Registro[]> {
  return request('/api/v1/registros')
}

export function crearRegistro(datos: Omit<Registro, 'id'>) {
  return request('/api/v1/registros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
}

export function actualizarRegistro(id: number, datos: Omit<Registro, 'id'>) {
  return request(`/api/v1/registros/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
}

export function eliminarRegistro(id: number) {
  return request(`/api/v1/registros/${id}`, { method: 'DELETE' })
}

export function importarRegistros(registros: Omit<Registro, 'id'>[]) {
  return request('/api/v1/importar-excel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registros),
  })
}
