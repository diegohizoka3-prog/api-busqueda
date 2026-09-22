# api-busqueda

API REST para buscar en datos academicos.

## Uso local

```bash
npm install
npm start
```

El servidor usa el puerto `3000` por defecto o `process.env.PORT`. La documentacion Swagger esta disponible en `/api/v1/docs`.

## Registro JSON

Cada registro requiere `salon`, `profesor`, `carrera`, `modulo`, `horarioClase` y `nombreModulo`.

Los datos se almacenan en memoria y se pierden al reiniciar el proceso.