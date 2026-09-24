# api-busqueda

API REST para buscar en datos academicos.

## Uso local

```bash
npm install
npm start
```

El servidor usa el puerto `3000` por defecto o `process.env.PORT`. La documentacion Swagger esta disponible en `/api/v1/docs`.

## Endpoints principales

- `GET /` devuelve el estado de la API.
- `GET /docs` redirige a Swagger.
- `GET /api/v1/docs/` abre la documentacion interactiva.
- `GET /api/v1/health` comprueba la salud del servicio.

## Registro JSON

Cada registro requiere `salon`, `profesor`, `carrera`, `modulo`, `horarioClase` y `nombreModulo`.

Los datos se almacenan en memoria y se pierden al reiniciar el proceso.

## Despliegue

### GitHub

El repositorio remoto es `https://github.com/diegohizoka3-prog/api-busqueda.git`.

```bash
git add .
git commit -m "Preparar despliegue de api-busqueda"
git push origin main
```

### Vercel

El archivo `api/index.js` expone la app Express y `vercel.json` conserva las rutas actuales. En Vercel, importa el repositorio de GitHub y usa estos valores:

- Build command: dejar vacio.
- Install command: `npm install`.
- Output directory: dejar vacio.
- Variable opcional: `DATABASE_URL` para activar PostgreSQL.

Despues del despliegue, las rutas quedan disponibles en:

- `https://TU-DOMINIO.vercel.app/`
- `https://TU-DOMINIO.vercel.app/docs`
- `https://TU-DOMINIO.vercel.app/api/v1/docs/`