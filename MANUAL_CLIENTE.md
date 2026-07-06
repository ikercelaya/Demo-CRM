# Manual rapido de MOMA CRM

Este CRM es una demo para visualizar como podria funcionar una plataforma interna de MOMA antes de desarrollar la version definitiva.

La demo no usa base de datos. Todos los clientes, metricas, facturas, conversaciones e incidencias son datos ficticios de prueba.

## Acceso

- URL del CRM: `/`
- Panel interno: `/app.html`
- Chatbot publico: `/chat.html`

Credenciales de prueba:

- Usuario: `admin@momaep.es`
- Contrasena: `moma2025`

Tambien funciona:

- Usuario: `direccion@momaep.es`
- Contrasena: `moma2025`

## Que incluye la plataforma

### Cuadro de Mando

Muestra los indicadores principales del centro:

- usuarios activos
- altas y bajas del mes
- crecimiento neto
- permanencia media
- ocupacion media
- facturacion
- beneficio
- lista de espera

Tambien incluye graficos de usuarios activos, altas vs bajas, ocupacion, facturacion y resultados del Test MOMA.

### Clientes

Listado de clientes de prueba con:

- nombre y contacto
- entrenador asignado
- plan contratado
- servicios activos
- cuota
- horario
- estado
- situacion de pago

Se puede buscar y filtrar por estado, entrenador o pago.

### Lista de espera

Recoge personas interesadas en entrar en MOMA. Sirve para ver:

- orden de llegada
- servicio solicitado
- horario deseado
- origen del contacto
- estado de la solicitud

### Ocupacion

Ayuda a entender si el centro esta aprovechando bien sus plazas:

- ocupacion media
- plazas disponibles
- reservas totales
- clases llenas
- ocupacion por horario, dia y entrenador
- clases con baja ocupacion

### Equipo

Muestra el rendimiento de los entrenadores:

- ocupacion de sus clases
- usuarios asignados
- clases impartidas
- bajas asociadas
- cumplimiento de protocolos
- valoracion media

### Servicios Mind/Body

Resume el crecimiento de los servicios complementarios:

- Nutricion
- BodyMind
- Mindfulness
- Talleres

Tambien muestra clientes por servicio, ocupacion de sesiones y conversion desde entrenamiento.

### Facturacion

Incluye una vision simple del negocio:

- facturacion total
- gastos
- beneficio
- margen
- ingreso medio por cliente
- facturacion por servicio
- gastos por categoria

### Marketing

Sirve para ver de donde vienen los clientes:

- leads generados
- clientes nuevos
- tasa de conversion
- origen de clientes
- motivos de baja

### Conversaciones

Centraliza los chats con clientes y leads. Incluye conversaciones de prueba y las conversaciones creadas desde el chatbot publico.

### Incidencias

Registro de problemas del centro:

- fecha
- tipo de incidencia
- descripcion
- responsable
- prioridad
- estado

### Alertas

Agrupa avisos importantes:

- usuarios con impagos
- clases con baja ocupacion
- entrenadores con muchas bajas
- servicios con baja venta

## Chatbot

El chatbot esta disponible en `/chat.html`.

Permite simular conversaciones con clientes o leads. Puede responder sobre:

- informacion para apuntarse
- horarios
- lista de espera
- cambios de horario
- reservas
- bajas
- servicios Mind/Body
- impagos

Las conversaciones nuevas se guardan en el navegador y aparecen en el apartado Conversaciones del CRM.

## Importante

Esta version es solo una demo visual y funcional. No sustituye todavia a Drive, formularios, facturacion real ni APP MOMA.

Para una version real habria que conectar:

- base de datos
- formularios de alta, baja y cambios
- facturacion
- APP MOMA o Virtuagym
- usuarios y permisos reales
- chatbot con datos reales del centro
