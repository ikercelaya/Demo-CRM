# MOMA CRM Demo

Demo navegable de CRM para MOMA Entrenamiento Personal, pensada para subir directamente a Vercel y enseñar el concepto antes de implementar una base de datos real.

## Acceso

- URL CRM: `/` o `/admin`
- URL chat publico: `/chat.html` o `/chat`
- Usuario: `admin@momaep.es`
- Contraseña: `MomaDemo2026!`

## Que incluye

- Cuadro de mando directivo con crecimiento, ocupacion, altas, bajas, rentabilidad, facturacion y alertas.
- Clientes, leads/lista de espera, planning de clases, equipo, facturacion, rentabilidad, servicios Mind/Body/Nutri, resultados Test MOMA, recursos, checklists, calendario e incidencias.
- Apartado de conversaciones con chats de prueba y conversaciones creadas desde la pagina publica de chat en el mismo navegador.
- Endpoint serverless `/api/chat` con respuestas simuladas para la demo.
- Datos mock en `assets/js/data.js`.

## Sin base de datos

Esta demo no usa base de datos ni servicios externos. Los datos son mock y algunos cambios se guardan solo en `localStorage` del navegador para poder enseñar interaccion basica.

## Despliegue en Vercel

1. Sube todo el contenido de esta carpeta a tu repositorio.
2. Importa el repositorio en Vercel.
3. No hace falta configurar variables de entorno.
4. Vercel detectara el proyecto estatico y publicara tambien el endpoint `/api/chat`.

## Desarrollo local

Para probar el endpoint localmente puedes usar Vercel CLI:

```bash
npx vercel dev
```

Tambien puedes abrir `index.html` directamente para revisar la interfaz. En ese modo el chat usa una respuesta local de respaldo si no existe `/api/chat`.
