# Problem Details (RFC 9457)

Este proyecto usa el estandar "Problem Details" para respuestas de error.
El media type es `application/problem+json`.

## Estructura base

```json
{
  "type": "https://docs.trust-taller.com/errors/validation-error",
  "title": "Bad Request",
  "status": 400,
  "detail": "Validation error",
  "instance": "/api/auth/register"
}
```

## Campos

- `type`: URI que identifica el tipo de problema.
- `title`: resumen legible.
- `status`: codigo HTTP.
- `detail`: detalle especifico del error.
- `instance`: ruta de la request.

## Extensiones

Se incluyen extensiones cuando aplica. Ejemplo en errores de validacion:

```json
{
  "type": "https://docs.trust-taller.com/errors/validation-error",
  "title": "Bad Request",
  "status": 400,
  "detail": "Validation error",
  "instance": "/api/auth/register",
  "errors": [
    { "path": "email", "message": "Invalid email address" }
  ]
}
```
