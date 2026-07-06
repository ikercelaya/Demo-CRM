window.MOMA_DEMO_DATA = {
  credentials: {
    email: "admin@momaep.es",
    password: "MomaDemo2026!"
  },
  business: {
    name: "MOMA Entrenamiento Personal",
    month: "Julio 2026",
    tagline: "Entrenamiento funcional, bienestar y comunidad en grupos reducidos."
  },
  kpis: [
    { label: "Usuarios activos", value: 326, suffix: "", trend: "+5,8%", hint: "18 clientes netos este mes" },
    { label: "Altas del mes", value: 31, suffix: "", trend: "+14%", hint: "12 vienen desde lista de espera" },
    { label: "Bajas del mes", value: 13, suffix: "", trend: "-8%", hint: "Principal motivo: horarios" },
    { label: "Ocupación media", value: 84, suffix: "%", trend: "+3 pts", hint: "Tarde al 93%" },
    { label: "Facturación total", value: 62480, suffix: "€", trend: "+9,2%", hint: "Entrenamiento pesa el 68%" },
    { label: "Beneficio mensual", value: 17120, suffix: "€", trend: "+6,1%", hint: "Margen 27,4%" },
    { label: "Ingreso medio cliente", value: 192, suffix: "€", trend: "+4€", hint: "1,42 servicios por cliente" },
    { label: "Lista de espera", value: 39, suffix: "", trend: "+7", hint: "18 prefieren tarde" }
  ],
  monthly: [
    { month: "Feb", users: 282, altas: 20, bajas: 11, revenue: 51200, profit: 13200, occupancy: 76, waitlist: 21, mind: 35 },
    { month: "Mar", users: 293, altas: 24, bajas: 13, revenue: 53840, profit: 14100, occupancy: 79, waitlist: 24, mind: 39 },
    { month: "Abr", users: 301, altas: 22, bajas: 14, revenue: 56220, profit: 14980, occupancy: 81, waitlist: 28, mind: 44 },
    { month: "May", users: 309, altas: 25, bajas: 17, revenue: 57960, profit: 15440, occupancy: 82, waitlist: 32, mind: 48 },
    { month: "Jun", users: 308, altas: 18, bajas: 19, revenue: 58880, profit: 15860, occupancy: 81, waitlist: 34, mind: 52 },
    { month: "Jul", users: 326, altas: 31, bajas: 13, revenue: 62480, profit: 17120, occupancy: 84, waitlist: 39, mind: 59 }
  ],
  flow: [
    { title: "Lead", text: "Formulario web, recomendación, Instagram o evento. Entra con origen y preferencia horaria." },
    { title: "Lista de espera", text: "Se ordena por fecha, servicio y disponibilidad. El equipo ofrece huecos libres." },
    { title: "Alta", text: "Datos personales, servicio contratado, entrenador asignado, consentimiento y primera valoración." },
    { title: "Operativa mensual", text: "Reservas, cambios de horario, asistencia, impagos, checklists y evolución del cliente." },
    { title: "Baja o fidelización", text: "Motivo de baja, valoración, informe y oportunidades de reactivación." }
  ],
  alerts: [
    { type: "danger", title: "7 usuarios con impago activo", detail: "Administración debe avisar antes del día 10." },
    { type: "warn", title: "Martes 15:00 baja ocupación", detail: "Ocupación del 48%. Revisar redistribución horaria." },
    { type: "warn", title: "Abel acumula 5 bajas", detail: "Analizar motivos: horarios y cambio de objetivos." },
    { type: "positive", title: "Mind360 crece un 18%", detail: "Mejor conversión desde entrenamiento personal." }
  ],
  clients: [
    { name: "Laura Fernández", status: "Activo", trainer: "Camilo", services: ["Entrenamiento", "NutriMind"], plan: "3 días/semana", since: "2024-02-14", ltv: 3480, risk: "Bajo", attendance: 91 },
    { name: "Sergio Lema", status: "Activo", trainer: "Andrea", services: ["Entrenamiento"], plan: "2 días/semana", since: "2023-11-04", ltv: 2860, risk: "Medio", attendance: 78 },
    { name: "Paula Castro", status: "Activo", trainer: "Abel", services: ["Entrenamiento", "BodyMind"], plan: "3 días/semana", since: "2025-01-21", ltv: 1980, risk: "Bajo", attendance: 88 },
    { name: "Marcos Vila", status: "Impago", trainer: "Camilo", services: ["Entrenamiento"], plan: "2 días/semana", since: "2024-08-12", ltv: 2210, risk: "Alto", attendance: 66 },
    { name: "Nerea Pardo", status: "Activo", trainer: "Marta", services: ["EnergyMind"], plan: "1 día/semana", since: "2025-09-02", ltv: 740, risk: "Bajo", attendance: 94 },
    { name: "Diego Conde", status: "Reserva", trainer: "Abel", services: ["Entrenamiento"], plan: "Reserva agosto", since: "2023-03-18", ltv: 4920, risk: "Medio", attendance: 0 },
    { name: "Iria Santos", status: "Activo", trainer: "Andrea", services: ["Entrenamiento", "Mind360"], plan: "3 días/semana", since: "2024-05-25", ltv: 3150, risk: "Bajo", attendance: 97 },
    { name: "Hugo Prieto", status: "Baja solicitada", trainer: "Abel", services: ["Entrenamiento"], plan: "2 días/semana", since: "2025-10-11", ltv: 980, risk: "Alto", attendance: 52 },
    { name: "Alicia Rivas", status: "Activo", trainer: "Camilo", services: ["Entrenamiento", "BodyMind", "NutriMind"], plan: "4 días/semana", since: "2022-12-09", ltv: 6850, risk: "Bajo", attendance: 93 },
    { name: "Bruno Costa", status: "Activo", trainer: "Marta", services: ["Entrenamiento"], plan: "Streaming", since: "2026-03-06", ltv: 430, risk: "Medio", attendance: 74 }
  ],
  leads: [
    { name: "Noa Vázquez", origin: "Instagram", service: "Entrenamiento", preferred: "Tarde", status: "Pendiente hueco", daysWaiting: 3, score: 92 },
    { name: "Álvaro Rey", origin: "Recomendación", service: "BodyMind", preferred: "Mañana", status: "Llamar", daysWaiting: 5, score: 81 },
    { name: "Carla Souto", origin: "Web", service: "NutriMind", preferred: "Mediodía", status: "Cita valoración", daysWaiting: 1, score: 76 },
    { name: "Miguel Pena", origin: "Evento", service: "Entrenamiento", preferred: "Tarde", status: "Horario ofrecido", daysWaiting: 9, score: 88 },
    { name: "Sara Mallo", origin: "Instagram", service: "Mind360", preferred: "Tarde", status: "Pendiente hueco", daysWaiting: 12, score: 69 },
    { name: "Iván Lago", origin: "Web", service: "Entrenamiento", preferred: "Mañana", status: "Formulario alta enviado", daysWaiting: 2, score: 95 },
    { name: "Lola Pereira", origin: "Recomendación", service: "EnergyMind", preferred: "Tarde", status: "Llamar", daysWaiting: 6, score: 73 }
  ],
  leadSources: [
    { label: "Instagram", value: 42 },
    { label: "Recomendación", value: 31 },
    { label: "Eventos", value: 15 },
    { label: "Web", value: 12 }
  ],
  trainers: [
    { name: "Camilo", classes: 84, occupancy: 92, users: 86, cancellations: 2, rating: 4.8, protocol: 96, payrollCost: 3920 },
    { name: "Andrea", classes: 76, occupancy: 88, users: 74, cancellations: 3, rating: 4.9, protocol: 98, payrollCost: 3650 },
    { name: "Abel", classes: 72, occupancy: 71, users: 66, cancellations: 9, rating: 4.2, protocol: 84, payrollCost: 3450 },
    { name: "Marta", classes: 58, occupancy: 79, users: 49, cancellations: 4, rating: 4.6, protocol: 91, payrollCost: 3120 },
    { name: "Roi", classes: 46, occupancy: 83, users: 38, cancellations: 1, rating: 4.7, protocol: 93, payrollCost: 2840 }
  ],
  schedule: [
    { day: "Lunes", time: "07:00", trainer: "Camilo", zone: "Sala 1", booked: 6, capacity: 6 },
    { day: "Lunes", time: "08:00", trainer: "Andrea", zone: "Sala 2", booked: 5, capacity: 6 },
    { day: "Lunes", time: "15:00", trainer: "Abel", zone: "Sala 1", booked: 3, capacity: 6 },
    { day: "Martes", time: "18:00", trainer: "Camilo", zone: "Sala 3", booked: 6, capacity: 6 },
    { day: "Martes", time: "19:00", trainer: "Marta", zone: "Sala 2", booked: 6, capacity: 6 },
    { day: "Miércoles", time: "10:00", trainer: "Roi", zone: "Streaming", booked: 7, capacity: 10 },
    { day: "Miércoles", time: "20:00", trainer: "Andrea", zone: "Sala 1", booked: 6, capacity: 6 },
    { day: "Jueves", time: "14:00", trainer: "Abel", zone: "Sala 2", booked: 2, capacity: 6 },
    { day: "Viernes", time: "09:00", trainer: "Marta", zone: "Sala 3", booked: 5, capacity: 6 },
    { day: "Viernes", time: "17:00", trainer: "Camilo", zone: "Sala 1", booked: 6, capacity: 6 }
  ],
  occupancyBySlot: [
    { label: "Mañana", value: 82 },
    { label: "Mediodía", value: 67 },
    { label: "Tarde", value: 93 },
    { label: "Streaming", value: 70 }
  ],
  revenueByService: [
    { label: "Entrenamiento", value: 42460 },
    { label: "BodyMind", value: 7280 },
    { label: "NutriMind", value: 4920 },
    { label: "Mind360", value: 3860 },
    { label: "EnergyMind", value: 2440 },
    { label: "Talleres", value: 1520 }
  ],
  expenses: [
    { label: "Personal", value: 23800 },
    { label: "Alquiler", value: 7200 },
    { label: "Marketing", value: 2800 },
    { label: "Software", value: 960 },
    { label: "Material", value: 2100 },
    { label: "Suministros", value: 2500 }
  ],
  invoices: [
    { number: "MOMA-2026-0712", client: "Laura Fernández", service: "Entrenamiento + NutriMind", amount: 245, status: "Pagada", date: "2026-07-01" },
    { number: "MOMA-2026-0713", client: "Sergio Lema", service: "Entrenamiento", amount: 158, status: "Pagada", date: "2026-07-01" },
    { number: "MOMA-2026-0714", client: "Marcos Vila", service: "Entrenamiento", amount: 158, status: "Impago", date: "2026-07-01" },
    { number: "MOMA-2026-0715", client: "Alicia Rivas", service: "Plan integral", amount: 318, status: "Pagada", date: "2026-07-02" },
    { number: "MOMA-2026-0716", client: "Hugo Prieto", service: "Entrenamiento", amount: 158, status: "Revisar baja", date: "2026-07-02" }
  ],
  services: [
    { name: "Entrenamiento", clients: 286, occupancy: 84, conversion: 100, revenue: 42460, rating: 4.7 },
    { name: "BodyMind", clients: 61, occupancy: 78, conversion: 18, revenue: 7280, rating: 4.8 },
    { name: "NutriMind", clients: 43, occupancy: 74, conversion: 13, revenue: 4920, rating: 4.6 },
    { name: "EnergyMind", clients: 29, occupancy: 69, conversion: 8, revenue: 2440, rating: 4.5 },
    { name: "Mind360", clients: 37, occupancy: 81, conversion: 11, revenue: 3860, rating: 4.9 }
  ],
  testResults: [
    { label: "Fuerza", before: 62, after: 78 },
    { label: "Resistencia", before: 58, after: 75 },
    { label: "Movilidad", before: 54, after: 72 },
    { label: "Estrés", before: 68, after: 42, inverse: true },
    { label: "Sueño", before: 56, after: 74 },
    { label: "Energía", before: 60, after: 81 }
  ],
  inventory: [
    { item: "Bandas elásticas", category: "Material entrenamiento", stock: 18, min: 12, lastPurchase: "2026-06-18", owner: "Coordinación" },
    { item: "Magnesio líquido", category: "Consumibles", stock: 4, min: 8, lastPurchase: "2026-05-29", owner: "Contabilidad" },
    { item: "Toallas vestuario", category: "Centro", stock: 46, min: 40, lastPurchase: "2026-06-21", owner: "Limpieza" },
    { item: "Camisetas equipo", category: "Equipación", stock: 9, min: 10, lastPurchase: "2026-04-12", owner: "Dirección" },
    { item: "Esterillas BodyMind", category: "Zona Mind", stock: 16, min: 14, lastPurchase: "2026-06-02", owner: "Marta" }
  ],
  checklists: [
    { area: "Entrenadores", task: "Registro de asistencia en APP MOMA", score: 94, owner: "Camilo", status: "Correcto" },
    { area: "Entrenadores", task: "Evaluación técnica semanal", score: 82, owner: "Abel", status: "Revisar" },
    { area: "Centro", task: "Limpieza vestuarios mañana", score: 96, owner: "Limpieza", status: "Correcto" },
    { area: "Centro", task: "Reposición consumibles", score: 74, owner: "Coordinación", status: "Pendiente" },
    { area: "Administración", task: "Aviso a usuarios morosos", score: 68, owner: "Contabilidad", status: "Urgente" }
  ],
  events: [
    { day: 2, title: "Test MOMA trimestral", type: "test" },
    { day: 4, title: "Taller movilidad", type: "event" },
    { day: 8, title: "Vacaciones Roi", type: "team" },
    { day: 10, title: "Descarga semana 1", type: "training" },
    { day: 14, title: "Revisión impagos", type: "admin" },
    { day: 17, title: "Evento comunidad", type: "event" },
    { day: 23, title: "Mind360 grupo", type: "mind" },
    { day: 29, title: "Cierre facturación", type: "admin" }
  ],
  incidents: [
    { title: "Aire acondicionado Sala 2", status: "Abierta", priority: "Alta", owner: "Coordinación", detail: "Falla en clases de tarde. Técnico avisado." },
    { title: "Cliente sin registro de asistencia", status: "Abierta", priority: "Media", owner: "Andrea", detail: "Revisar APP MOMA y corregir métrica mensual." },
    { title: "Pedido magnesio líquido", status: "En curso", priority: "Media", owner: "Contabilidad", detail: "Stock por debajo del mínimo." },
    { title: "Cambio horario Hugo Prieto", status: "En curso", priority: "Alta", owner: "Abel", detail: "Riesgo de baja si no se ofrece alternativa." },
    { title: "Checklist limpieza vestuario", status: "Resuelta", priority: "Media", owner: "Limpieza", detail: "Añadido control de reposición." },
    { title: "Reserva agosto Diego Conde", status: "Resuelta", priority: "Baja", owner: "Administración", detail: "Reserva marcada y facturación pausada." }
  ],
  conversations: [
    {
      id: "conv-001",
      clientName: "Noa Vázquez",
      channel: "Chat web",
      status: "Lead caliente",
      intent: "Lista de espera",
      lastMessage: "Me vendría bien entrenar por la tarde, ¿hay plaza?",
      updatedAt: "2026-07-06 10:42",
      profile: {
        phone: "666 104 233",
        email: "noa.vazquez@example.com",
        source: "Instagram",
        nextStep: "Ofrecer hueco martes 19:00"
      },
      messages: [
        { role: "bot", text: "Hola, soy el asistente de MOMA. ¿En qué puedo ayudarte?" },
        { role: "client", text: "Quiero apuntarme a entrenamiento personal en grupo reducido." },
        { role: "bot", text: "Genial. Trabajamos con grupos reducidos y seguimiento personalizado. ¿Qué horario prefieres?" },
        { role: "client", text: "Me vendría bien entrenar por la tarde, ¿hay plaza?" },
        { role: "staff", text: "Hay un hueco posible los martes a las 19:00. La llamamos hoy." }
      ]
    },
    {
      id: "conv-002",
      clientName: "Marcos Vila",
      channel: "WhatsApp",
      status: "Impago",
      intent: "Facturación",
      lastMessage: "Creo que la tarjeta me ha fallado, lo reviso hoy.",
      updatedAt: "2026-07-05 18:20",
      profile: {
        phone: "655 720 118",
        email: "marcos.vila@example.com",
        source: "Cliente activo",
        nextStep: "Reintentar cobro día 8"
      },
      messages: [
        { role: "staff", text: "Hola Marcos, tenemos pendiente la cuota de julio." },
        { role: "client", text: "Creo que la tarjeta me ha fallado, lo reviso hoy." },
        { role: "staff", text: "Perfecto, si necesitas que te enviemos enlace de pago nos dices." }
      ]
    },
    {
      id: "conv-003",
      clientName: "Carla Souto",
      channel: "Chat web",
      status: "Cita valoración",
      intent: "NutriMind",
      lastMessage: "Me interesa combinar nutrición con entrenamiento.",
      updatedAt: "2026-07-05 12:08",
      profile: {
        phone: "644 890 221",
        email: "carla.souto@example.com",
        source: "Web",
        nextStep: "Agendar primera valoración"
      },
      messages: [
        { role: "bot", text: "Hola, soy el asistente de MOMA. Puedo ayudarte con entrenamiento, BodyMind, NutriMind, EnergyMind o Mind360." },
        { role: "client", text: "Me interesa combinar nutrición con entrenamiento." },
        { role: "bot", text: "Tiene sentido. NutriMind se puede trabajar como servicio complementario. ¿Quieres que el equipo te proponga una valoración?" },
        { role: "client", text: "Sí, por la mañana puedo." }
      ]
    }
  ],
  automations: [
    { step: "Formulario lista de espera", tool: "Google Forms / Web", status: "Mock conectado", result: "Crea lead y prioriza por horario" },
    { step: "Formulario alta", tool: "Alta cliente", status: "Mock conectado", result: "Crea ficha, plan, entrenador y primera cuota" },
    { step: "Cambios de horario", tool: "Reservas", status: "Mock conectado", result: "Actualiza planning y ocupación" },
    { step: "Formulario baja", tool: "Bajas", status: "Mock conectado", result: "Guarda motivo, valoración y entrenador asociado" },
    { step: "Contabilidad", tool: "Facturación", status: "Mock manual", result: "Importa impagos y facturación mensual" },
    { step: "APP MOMA / Virtuagym", tool: "Asistencia", status: "Pendiente real", result: "Alimentaría ocupación, asistencia y permanencia" }
  ]
};
