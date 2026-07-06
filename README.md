# MOMA CRM — Demo

CRM básico para un centro deportivo / gimnasio (demo para **MOMA**, [momaep.es](https://www.momaep.es)).
Reúne en una sola plataforma el **cuadro de mando de dirección**, la base de clientes, la
ocupación del centro, el rendimiento del equipo, la facturación, el marketing, un
**inbox de conversaciones** y un **chatbot** para la web.

> ⚠️ **Es una demo.** No usa base de datos. Todos los datos son **ficticios** y se generan
> en el navegador para poder enseñar métricas y pantallas al cliente antes de implementar
> la versión real. La “autenticación” es simbólica (solo cliente) y no protege información real.

---

## 🔑 Credenciales de acceso

| Campo | Valor |
|-------|-------|
| **Usuario** | `admin@momaep.es` |
| **Contraseña** | `moma2025` |

_(También funciona `direccion@momaep.es` / `moma2025`.)_

Las credenciales aparecen también en la propia pantalla de login.

---

## 🧭 Qué incluye

Cubre las áreas del documento “Cuadro de Mando MOMA (Dirección)”:

| Sección | Contenido |
|---------|-----------|
| **Cuadro de Mando** | KPIs de dirección + 8 gráficos: usuarios activos, altas/bajas, ocupación por horario y franja, ocupación por entrenador, facturación por servicio, facturación mensual y radar del **Test MOMA**. |
| **Clientes** | Base de datos de usuarios con buscador y filtros (estado, entrenador, pago). |
| **Lista de espera** | Personas esperando plaza, con orden de llegada y estado (“Horario ofrecido”). |
| **Ocupación** | Ocupación media, plazas, reservas, clases llenas, ocupación por horario/día/entrenador y clases con baja ocupación. |
| **Equipo** | Rendimiento por entrenador: ocupación, usuarios, clases, bajas, protocolos y valoración. |
| **Servicios Mind/Body** | Clientes por servicio, conversión desde entrenamiento, ocupación de sesiones Mind y evolución del área. |
| **Facturación** | Facturación total y por servicio, gastos por categoría, beneficio, margen e ingreso medio por cliente. |
| **Marketing** | Leads, clientes nuevos, conversión y origen de clientes; motivos de baja. |
| **Conversaciones** | Inbox con **todos los chats con clientes y leads**, incluidas las del chatbot web. |
| **Incidencias** | Registro centralizado de incidencias del centro. |
| **Alertas** | Impagos, clases con baja ocupación, entrenadores con muchas bajas y servicios con baja venta. |

### 💬 Chatbot (`/chat.html`)
Asistente conversacional sencillo, al estilo del ejemplo aportado. Vive en el mismo
despliegue: la web `/chat.html` con el widget flotante y el **endpoint** `POST /api/chat`
(función serverless, sin IA externa ni claves). Las conversaciones nuevas aparecen
automáticamente en la sección **Conversaciones** del CRM.

---

## 🚀 Puesta en marcha

### Opción A — Desplegar en Vercel (recomendado)
1. Sube esta carpeta a un repositorio de GitHub (o arrastra el `.zip` en Vercel).
2. En [vercel.com](https://vercel.com) → **Add New Project** → importa el repo.
3. **Framework Preset:** `Other`. No hace falta build command ni configuración extra.
4. **Deploy.** Vercel sirve los archivos estáticos y expone `/api/chat` como función serverless.

Rutas una vez desplegado:
- `/` → login del CRM
- `/app.html` → panel / cuadro de mando
- `/chat.html` → página pública del chatbot
- `/api/chat` → endpoint del asistente

### Opción B — Probar en local
```bash
# Cualquier servidor estático sirve para ver el CRM:
npx serve .
# …o, para que además funcione el endpoint /api/chat como en Vercel:
npm i -g vercel && vercel dev
```

> Si abres los `.html` como archivo local (`file://`) el CRM funciona igual; el chatbot
> usa una respuesta de reserva cuando `/api/chat` no está disponible.

### Prueba del chatbot (opcional)
```bash
npm test   # ejecuta scripts/test-chat.js
```

---

## 🗂️ Estructura

```
.
├── index.html            · Login
├── app.html              · CRM (SPA con todas las secciones)
├── chat.html             · Página pública del chatbot
├── api/
│   └── chat.js           · Endpoint serverless del asistente (reglas)
├── assets/
│   ├── css/styles.css    · Estilos
│   └── js/
│       ├── data.js       · Generador de datos ficticios (semilla fija)
│       ├── app.js        · Lógica del CRM y gráficos
│       ├── auth.js       · Login de demo (sessionStorage)
│       ├── chat-widget.js· Widget del chatbot
│       └── vendor/       · Chart.js (incluido localmente)
├── scripts/test-chat.js  · Prueba del motor del chatbot
├── vercel.json
└── package.json
```

---

## 🔧 Notas para pasar a producción
Cuando se apruebe la demo, los siguientes pasos convierten esto en una app real:
- **Base de datos** (p. ej. Postgres/Supabase) sustituyendo `data.js`.
- **Autenticación real** con usuarios, roles y contraseñas cifradas.
- **Conexión de los formularios** (alta, baja, modificaciones, lista de espera) y de la
  **facturación** para eliminar el trabajo manual actual con Drive.
- Integración con **Virtuagym / APP MOMA** para asistencia y reservas.
- Chatbot con IA (Claude) conectado a la base de datos para respuestas y agenda reales.
