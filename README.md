# api-busqueda

API REST + frontend para consulta de registros académicos.

## URLs de producción

- Backend: https://api-busqueda-ejehmqinu-diegohizoka3-1705.vercel.app
- Swagger: https://api-busqueda-ejehmqinu-diegohizoka3-1705.vercel.app/api/v1/docs
- Frontend: https://api-busqueda-2d1n0pzfg-diegohizoka3-1705.vercel.app

## Estructura del proyecto

- `api/` — backend Express
- `src/` — lógica del motor de búsqueda, datos y persistencia
- `web/` — frontend en Next.js
- `vercel.json` — configuración del backend en Vercel
- `scripts/` — utilidades de seed y carga de datos

## Requisitos para desarrolladores

### Backend (raíz)

```bash
npm install
npm start
```

El servidor usa el puerto `3000` o `process.env.PORT`. La documentación Swagger está en:

- `/api/v1/docs`
- `/api/v1/docs/`

### Frontend (web)

```bash
cd web
npm install
npm run dev
```

La app corre en el puerto por defecto de Next.js y usa la variable `NEXT_PUBLIC_API_URL` para apuntar al backend.

## Endpoints principales

- `GET /` — estado del servicio
- `GET /api/v1/health` — comprobación de salud
- `GET /api/v1/docs` — Swagger UI
- `GET /api/v1/search` — búsqueda general
- `GET /api/v1/estadisticas` — estadísticas

## Persistencia y DATABASE_URL

La aplicación puede usar una base de datos externa si se configura `DATABASE_URL` en el entorno del backend.

Ejemplo:

```bash
export DATABASE_URL="postgresql://usuario:password@host:5432/dbname"
```

Si no se define, la app funciona en memoria para desarrollo local. Para producción en Vercel, añade la variable en el proyecto del backend.

## Despliegue

### Repositorio

https://github.com/diegohizoka3-prog/api-busqueda.git

### Vercel

- Backend: desplegado como proyecto raíz con `vercel.json`
- Frontend: desplegado desde `web/`
- Backend URL en entorno del frontend: `NEXT_PUBLIC_API_URL`

### GitHub

```bash
git add .
git commit -m "Preparar despliegue de api-busqueda"
git push origin main
```

## Nota

El backend y el frontend están separados en Vercel, con el frontend apuntando al backend público mediante la variable de entorno `NEXT_PUBLIC_API_URL`.