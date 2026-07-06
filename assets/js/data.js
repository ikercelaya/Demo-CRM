/* =============================================================
   MOMA CRM — Generador de datos de DEMO (sin base de datos)
   -------------------------------------------------------------
   Todos los datos son ficticios y se generan en el navegador con
   una semilla fija para que las métricas sean estables entre
   recargas. No hay backend ni persistencia real.
   ============================================================= */
(function (global) {
  'use strict';

  // ---- PRNG con semilla (mulberry32) para datos estables -----
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(20260706);
  const ri = (min, max) => Math.floor(rnd() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

  // ---- Etiquetas de meses (Jul 2025 -> Jun 2026) -------------
  const MESES = ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];

  // ---- Entrenadores ------------------------------------------
  const entrenadores = [
    { id: 'e1', nombre: 'Camilo Restrepo', ocupacion: 92, bajas: 2, usuarios: 46, clases: 78, valoracion: 4.8, protocolos: 96, color: '#22c55e' },
    { id: 'e2', nombre: 'Abel Nieto',      ocupacion: 71, bajas: 9, usuarios: 41, clases: 74, valoracion: 3.9, protocolos: 74, color: '#ef4444' },
    { id: 'e3', nombre: 'Lucía Vega',      ocupacion: 88, bajas: 3, usuarios: 44, clases: 80, valoracion: 4.7, protocolos: 92, color: '#3b82f6' },
    { id: 'e4', nombre: 'Marcos Ferrer',   ocupacion: 79, bajas: 5, usuarios: 38, clases: 70, valoracion: 4.3, protocolos: 85, color: '#f59e0b' },
    { id: 'e5', nombre: 'Sara Molina',     ocupacion: 86, bajas: 2, usuarios: 40, clases: 76, valoracion: 4.6, protocolos: 90, color: '#8b5cf6' }
  ];

  // ---- Catálogo de servicios ---------------------------------
  const servicios = ['Entrenamiento', 'Nutrición', 'BodyMind', 'Mindfulness', 'Talleres'];
  const planes = [
    { nombre: '2 días/semana', cuota: 45 },
    { nombre: '3 días/semana', cuota: 60 },
    { nombre: '4 días/semana', cuota: 75 },
    { nombre: 'Libre',         cuota: 90 }
  ];
  const horarios = ['07:00', '08:00', '09:00', '10:00', '12:00', '17:00', '18:00', '19:00', '20:00'];

  // ---- Nombres para clientes ---------------------------------
  const nombres = ['Laura', 'Javier', 'María', 'Carlos', 'Ana', 'David', 'Elena', 'Sergio', 'Paula', 'Miguel',
    'Carmen', 'Alberto', 'Sofía', 'Pablo', 'Marta', 'Diego', 'Nuria', 'Raúl', 'Cristina', 'Iván',
    'Lucía', 'Adrián', 'Sara', 'Álvaro', 'Beatriz', 'Rubén', 'Andrea', 'Jorge', 'Patricia', 'Hugo',
    'Silvia', 'Gonzalo', 'Rocío', 'Óscar', 'Natalia', 'Víctor', 'Irene', 'Daniel', 'Alba', 'Fernando'];
  const apellidos = ['García', 'Martínez', 'López', 'Sánchez', 'Pérez', 'Gómez', 'Fernández', 'Ruiz', 'Díaz',
    'Moreno', 'Muñoz', 'Álvarez', 'Romero', 'Alonso', 'Gutiérrez', 'Navarro', 'Torres', 'Domínguez',
    'Gil', 'Vázquez', 'Serrano', 'Ramos', 'Blanco', 'Molina', 'Castro', 'Ortega', 'Rubio', 'Marín'];

  const motivosBaja = ['Mudanza', 'Lesión', 'Precio', 'Falta de tiempo', 'Otros'];
  const origenes = ['Instagram', 'Recomendación', 'Eventos', 'Web'];

  function fecha(offsetDias) {
    // fecha relativa a "hoy" de la demo (2026-07-06)
    const base = new Date(2026, 6, 6);
    base.setDate(base.getDate() - offsetDias);
    return base.toISOString().slice(0, 10);
  }

  // ---- Generación de clientes --------------------------------
  const clientes = [];
  const NUM_CLIENTES = 205; // 186 activos + bajas + lista de espera se maneja aparte
  for (let i = 0; i < NUM_CLIENTES; i++) {
    const nombre = pick(nombres) + ' ' + pick(apellidos);
    const activo = rnd() > 0.11; // ~11% bajas
    const ent = pick(entrenadores);
    const plan = pick(planes);
    const serviciosCliente = ['Entrenamiento'];
    if (rnd() > 0.68) serviciosCliente.push('Nutrición');
    if (rnd() > 0.78) serviciosCliente.push('BodyMind');
    if (rnd() > 0.82) serviciosCliente.push('Mindfulness');
    if (rnd() > 0.9) serviciosCliente.push('Talleres');
    const impago = activo && rnd() > 0.93;
    clientes.push({
      id: 'C' + (1000 + i),
      nombre,
      email: nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ /g, '.') + '@email.com',
      telefono: '6' + ri(10, 99) + ' ' + ri(100, 999) + ' ' + ri(100, 999),
      entrenador: ent.nombre,
      entrenadorId: ent.id,
      plan: plan.nombre,
      cuota: plan.cuota + (serviciosCliente.length - 1) * ri(20, 45),
      servicios: serviciosCliente,
      horario: pick(horarios),
      alta: fecha(ri(20, 900)),
      estado: activo ? 'Activo' : 'Baja',
      motivoBaja: activo ? null : pick(motivosBaja),
      pago: impago ? 'Impago' : 'Al día',
      permanenciaMeses: ri(2, 34),
      valoracion: (3.5 + rnd() * 1.5).toFixed(1)
    });
  }
  const activos = clientes.filter(c => c.estado === 'Activo');
  const bajas = clientes.filter(c => c.estado === 'Baja');
  const impagos = activos.filter(c => c.pago === 'Impago');

  // ---- Serie mensual de altas / bajas / activos --------------
  let activosAcum = 150;
  const serieMensual = MESES.map((m, idx) => {
    const altas = ri(9, 22);
    const bajasMes = ri(4, 14);
    activosAcum += (altas - bajasMes);
    return {
      mes: m,
      altas,
      bajas: bajasMes,
      neto: altas - bajasMes,
      activos: activosAcum,
      facturacion: Math.round(46000 + idx * 1350 + (rnd() - 0.5) * 3000),
      ingresoMedio: Math.round((46000 + idx * 1350) / activosAcum),
      clientesMind: 22 + idx * 2 + ri(-2, 3)
    };
  });
  // ajustar el último mes de activos al número real de activos
  serieMensual[serieMensual.length - 1].activos = activos.length;
  serieMensual[serieMensual.length - 1].facturacion = 62000;

  // ---- Facturación por servicio (mes actual) -----------------
  const facturacionServicio = [
    { servicio: 'Entrenamiento', importe: 41000 },
    { servicio: 'Nutrición',     importe: 6500 },
    { servicio: 'BodyMind',      importe: 5800 },
    { servicio: 'Mindfulness',   importe: 4900 },
    { servicio: 'Talleres',      importe: 3800 }
  ];
  const facturacionTotal = facturacionServicio.reduce((a, b) => a + b.importe, 0); // 62.000

  // ---- Gastos por categoría (mes actual) ---------------------
  const gastos = [
    { categoria: 'Personal',  importe: 28000 },
    { categoria: 'Alquiler',  importe: 8500 },
    { categoria: 'Material',  importe: 3900 },
    { categoria: 'Marketing', importe: 3200 },
    { categoria: 'Software',  importe: 1400 }
  ];
  const gastosTotal = gastos.reduce((a, b) => a + b.importe, 0); // 45.000
  const beneficio = facturacionTotal - gastosTotal;             // 17.000
  const margen = Math.round((beneficio / facturacionTotal) * 100); // 27

  // ---- Ocupación ---------------------------------------------
  const ocupacionHorario = horarios.map(h => {
    const franja = (h < '12:00') ? 'Mañana' : (h < '17:00') ? 'Mediodía' : 'Tarde';
    return { hora: h, franja, ocupacion: ri(58, 98) };
  });
  const ocupacionDia = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(d => ({
    dia: d, ocupacion: ri(70, 95)
  }));
  const ocupacionFranja = [
    { franja: 'Mañana',   ocupacion: 88 },
    { franja: 'Mediodía', ocupacion: 64 },
    { franja: 'Tarde',    ocupacion: 91 }
  ];
  const ocupacionMedia = 84;
  const plazasTotales = 320;
  const reservasTotales = Math.round(plazasTotales * ocupacionMedia / 100);
  const clasesTotales = 62;
  const clasesLlenas = 19;
  const clasesBajaOcupacion = [
    { clase: 'Lunes 12:00 · Abel',      ocupacion: 42 },
    { clase: 'Miércoles 12:00 · Marcos', ocupacion: 51 },
    { clase: 'Viernes 20:00 · Abel',    ocupacion: 55 },
    { clase: 'Martes 10:00 · Sara',     ocupacion: 58 }
  ];

  // ---- Lista de espera ---------------------------------------
  const listaEspera = [];
  for (let i = 0; i < 14; i++) {
    listaEspera.push({
      id: 'LE' + (i + 1),
      nombre: pick(nombres) + ' ' + pick(apellidos),
      telefono: '6' + ri(10, 99) + ' ' + ri(100, 999) + ' ' + ri(100, 999),
      horarioDeseado: pick(horarios),
      servicio: pick(['Entrenamiento', 'Entrenamiento', 'BodyMind', 'Mindfulness']),
      origen: pick(origenes),
      fecha: fecha(ri(1, 60)),
      estado: pick(['En espera', 'En espera', 'En espera', 'Horario ofrecido'])
    });
  }

  // ---- Marketing ---------------------------------------------
  const origenClientes = origenes.map(o => ({
    origen: o,
    valor: o === 'Instagram' ? 38 : o === 'Recomendación' ? 34 : o === 'Web' ? 18 : 10
  }));
  const marketing = {
    leads: 96,
    clientesNuevos: 21,
    conversion: 22,
    origen: origenClientes
  };

  // ---- Motivos de baja (agregado) ----------------------------
  const motivosBajaAgg = motivosBaja.map(m => ({
    motivo: m,
    valor: bajas.filter(b => b.motivoBaja === m).length || ri(1, 5)
  }));

  // ---- Test MOMA (mejora media %) ----------------------------
  const testMoma = [
    { variable: 'Fuerza',      mejora: 18 },
    { variable: 'Resistencia', mejora: 22 },
    { variable: 'Movilidad',   mejora: 15 },
    { variable: 'Estrés',      mejora: 27 },
    { variable: 'Sueño',       mejora: 20 }
  ];

  // ---- Área Mind / Servicios ---------------------------------
  const clientesPorServicio = [
    { servicio: 'Entrenamiento', clientes: activos.length },
    { servicio: 'Nutrición',     clientes: activos.filter(c => c.servicios.includes('Nutrición')).length },
    { servicio: 'BodyMind',      clientes: activos.filter(c => c.servicios.includes('BodyMind')).length },
    { servicio: 'Mindfulness',   clientes: activos.filter(c => c.servicios.includes('Mindfulness')).length },
    { servicio: 'Talleres',      clientes: activos.filter(c => c.servicios.includes('Talleres')).length }
  ];
  const sesionesMind = [
    { sesion: 'Mindfulness',       ocupacion: 82 },
    { sesion: 'Grupo desarrollo',  ocupacion: 74 },
    { sesion: 'BowSpring',         ocupacion: 68 }
  ];
  const conversionMind = 18; // % de usuarios de entrenamiento que contratan otros servicios

  // ---- Incidencias -------------------------------------------
  const tiposIncidencia = ['Instalaciones', 'Material', 'Limpieza', 'App/Reservas', 'Atención', 'Facturación'];
  const incidencias = [];
  for (let i = 0; i < 12; i++) {
    incidencias.push({
      id: 'INC' + (100 + i),
      fecha: fecha(ri(0, 30)),
      tipo: pick(tiposIncidencia),
      prioridad: pick(['Alta', 'Media', 'Media', 'Baja']),
      estado: pick(['Abierta', 'Abierta', 'En curso', 'Resuelta', 'Resuelta']),
      descripcion: pick([
        'Aire acondicionado sala 2 no enfría',
        'Faltan mancuernas de 8kg',
        'Reserva duplicada en la app',
        'Vestuario femenino con grifo suelto',
        'Cliente reporta cobro duplicado',
        'Colchonetas desgastadas zona Mind',
        'Proyector taller no enciende',
        'Puerta de acceso se atasca'
      ]),
      responsable: pick(['Coordinación', 'Mantenimiento', 'Administración', 'Recepción'])
    });
  }

  // ---- Conversaciones (seed) ---------------------------------
  const conversaciones = buildConversaciones();

  function msg(from, text, min) {
    return { from, text, hora: min };
  }
  function buildConversaciones() {
    const base = [
      {
        id: 'CV1', nombre: 'Marta Colomer', telefono: '622 145 908', canal: 'Chatbot web',
        fecha: fecha(0), estado: 'Cita solicitada', etiqueta: 'Lead',
        mensajes: [
          msg('bot', 'Hola, soy el asistente de MOMA. Para atenderte mejor, ¿me indicas tu nombre completo?', '10:02'),
          msg('user', 'Hola, soy Marta Colomer', '10:03'),
          msg('bot', 'Encantado, Marta. ¿En qué puedo ayudarte?', '10:03'),
          msg('user', 'Quería información para apuntarme a entrenamiento', '10:04'),
          msg('bot', 'Genial. Trabajamos con grupos reducidos y entrenador asignado. ¿Qué franja te viene mejor: mañana, mediodía o tarde?', '10:04'),
          msg('user', 'Por las tardes, sobre las 19h', '10:05'),
          msg('bot', 'Perfecto. Ahora mismo la franja de tarde tiene mucha demanda. Te dejo en lista de espera y te aviso en cuanto haya plaza. ¿Me confirmas un teléfono de contacto?', '10:05'),
          msg('user', '622 145 908', '10:06'),
          msg('bot', '¡Anotado! Te contactamos en menos de 48h. ¿Quieres que te reserve también una sesión de valoración gratuita?', '10:06'),
          msg('user', 'Sí, perfecto', '10:07'),
          msg('bot', 'Hecho, Marta. Te esperamos en MOMA 💪', '10:07')
        ]
      },
      {
        id: 'CV2', nombre: 'Roberto Ares', telefono: '655 902 331', canal: 'Chatbot web',
        fecha: fecha(0), estado: 'Resuelta', etiqueta: 'Cliente',
        mensajes: [
          msg('bot', 'Hola, soy el asistente de MOMA. ¿Me indicas tu nombre completo?', '18:20'),
          msg('user', 'Roberto Ares', '18:21'),
          msg('bot', 'Hola Roberto, ¿en qué te ayudo?', '18:21'),
          msg('user', 'Necesito cambiar mi horario de 18h a 20h', '18:22'),
          msg('bot', 'Puedo tramitar tu solicitud de cambio de horario. ¿A partir de qué día lo necesitas?', '18:22'),
          msg('user', 'Desde el próximo lunes', '18:23'),
          msg('bot', 'Perfecto, dejo registrada la modificación de 18:00 a 20:00 desde el lunes. Tu entrenador lo confirmará. ¿Algo más?', '18:23'),
          msg('user', 'No, gracias!', '18:24'),
          msg('bot', '¡A ti, Roberto! Buen entreno 🙌', '18:24')
        ]
      },
      {
        id: 'CV3', nombre: 'Nerea Pons', telefono: '611 330 240', canal: 'Chatbot web',
        fecha: fecha(1), estado: 'Cita solicitada', etiqueta: 'Lead',
        mensajes: [
          msg('bot', 'Hola, soy el asistente de MOMA. ¿Me indicas tu nombre completo?', '09:10'),
          msg('user', 'Nerea Pons', '09:11'),
          msg('bot', 'Hola Nerea, ¿en qué puedo ayudarte?', '09:11'),
          msg('user', '¿Qué precio tiene la nutrición?', '09:12'),
          msg('bot', 'El servicio de Nutrición se puede contratar junto al entrenamiento. Incluye plan personalizado y seguimiento. ¿Quieres que te llame una nutricionista para darte el detalle?', '09:12'),
          msg('user', 'Sí por favor', '09:13'),
          msg('bot', 'Perfecto, lo dejo agendado. Te contactarán esta semana 😊', '09:13')
        ]
      },
      {
        id: 'CV4', nombre: 'Pablo Iniesta', telefono: '699 121 776', canal: 'Chatbot web',
        fecha: fecha(2), estado: 'Resuelta', etiqueta: 'Cliente',
        mensajes: [
          msg('bot', 'Hola, soy el asistente de MOMA. ¿Me indicas tu nombre completo?', '20:01'),
          msg('user', 'Pablo Iniesta', '20:02'),
          msg('bot', 'Hola Pablo, ¿en qué te ayudo?', '20:02'),
          msg('user', '¿Cuál es el horario del centro?', '20:03'),
          msg('bot', 'Abrimos de lunes a viernes de 07:00 a 22:00 y sábados de 09:00 a 14:00. ¿Necesitas algo más?', '20:03'),
          msg('user', 'Nada más, gracias', '20:04'),
          msg('bot', '¡Un placer, Pablo! 💪', '20:04')
        ]
      },
      {
        id: 'CV5', nombre: 'Alicia Ferrán', telefono: '644 887 012', canal: 'Chatbot web',
        fecha: fecha(3), estado: 'Baja solicitada', etiqueta: 'Cliente',
        mensajes: [
          msg('bot', 'Hola, soy el asistente de MOMA. ¿Me indicas tu nombre completo?', '12:40'),
          msg('user', 'Alicia Ferrán', '12:41'),
          msg('bot', 'Hola Alicia, ¿en qué puedo ayudarte?', '12:41'),
          msg('user', 'Quiero darme de baja, me mudo de ciudad', '12:42'),
          msg('bot', 'Lamento que te vayas, Alicia. Registro tu solicitud de baja por motivo "Mudanza". Administración te confirmará la fecha efectiva. ¿Quieres dejar alguna valoración de tu experiencia?', '12:42'),
          msg('user', 'Todo genial, sobre todo con Lucía', '12:43'),
          msg('bot', '¡Muchas gracias! Se lo trasladamos a Lucía. Te esperamos de vuelta cuando quieras 🙏', '12:43')
        ]
      },
      {
        id: 'CV6', nombre: 'Guillermo Sáez', telefono: '633 442 190', canal: 'Chatbot web',
        fecha: fecha(4), estado: 'Cita solicitada', etiqueta: 'Lead',
        mensajes: [
          msg('bot', 'Hola, soy el asistente de MOMA. ¿Me indicas tu nombre completo?', '17:15'),
          msg('user', 'Guillermo Sáez', '17:16'),
          msg('bot', 'Hola Guillermo, ¿en qué te ayudo?', '17:16'),
          msg('user', 'Me interesan las clases de mindfulness', '17:17'),
          msg('bot', 'Nuestra zona Mind ofrece Mindfulness, grupos de desarrollo y BowSpring. Son sesiones reducidas con colaboradoras especializadas. ¿Te reservo una sesión de prueba?', '17:17'),
          msg('user', 'Sí, la de mindfulness', '17:18'),
          msg('bot', 'Genial, lo dejo agendado y te confirmamos disponibilidad. 🧘', '17:18')
        ]
      },
      {
        id: 'CV7', nombre: 'Teresa Blanco', telefono: '677 010 553', canal: 'Chatbot web',
        fecha: fecha(5), estado: 'Resuelta', etiqueta: 'Cliente',
        mensajes: [
          msg('bot', 'Hola, soy el asistente de MOMA. ¿Me indicas tu nombre completo?', '08:30'),
          msg('user', 'Teresa Blanco', '08:31'),
          msg('bot', 'Hola Teresa, ¿en qué puedo ayudarte?', '08:31'),
          msg('user', 'Quiero reservar mi plaza el mes que viene, me voy de viaje', '08:32'),
          msg('bot', 'Puedes reservar tu plaza (máximo 2 meses al año). Registro tu solicitud de reserva para el próximo mes. Administración te confirmará. ¿Algo más?', '08:32'),
          msg('user', 'No, gracias', '08:33'),
          msg('bot', '¡Buen viaje, Teresa! 🙌', '08:33')
        ]
      },
      {
        id: 'CV8', nombre: 'Ignacio Mora', telefono: '622 778 341', canal: 'Chatbot web',
        fecha: fecha(6), estado: 'Impago', etiqueta: 'Cliente',
        mensajes: [
          msg('bot', 'Hola, soy el asistente de MOMA. ¿Me indicas tu nombre completo?', '19:44'),
          msg('user', 'Ignacio Mora', '19:45'),
          msg('bot', 'Hola Ignacio, ¿en qué te ayudo?', '19:45'),
          msg('user', 'Me ha llegado un aviso de recibo devuelto', '19:46'),
          msg('bot', 'Sí, consta un recibo pendiente de este mes. Puedes regularizarlo en recepción o por transferencia. Aviso a administración para que te contacte con los detalles. ¿Te parece?', '19:46'),
          msg('user', 'Perfecto, lo arreglo mañana', '19:47'),
          msg('bot', 'Gracias, Ignacio. Lo dejo anotado 🙏', '19:47')
        ]
      }
    ];
    return base;
  }

  // ---- Objeto expuesto ---------------------------------------
  const DATA = {
    generadoEl: '2026-07-06',
    centro: { nombre: 'MOMA', web: 'https://www.momaep.es' },
    meses: MESES,
    entrenadores,
    servicios,
    clientes,
    activos,
    bajas,
    impagos,
    listaEspera,
    serieMensual,
    facturacion: {
      porServicio: facturacionServicio,
      total: facturacionTotal,
      gastos,
      gastosTotal,
      beneficio,
      margen,
      costePersonal: 28000
    },
    ocupacion: {
      media: ocupacionMedia,
      plazasTotales,
      reservasTotales,
      clasesTotales,
      clasesLlenas,
      porHorario: ocupacionHorario,
      porDia: ocupacionDia,
      porFranja: ocupacionFranja,
      bajaOcupacion: clasesBajaOcupacion
    },
    marketing,
    motivosBaja: motivosBajaAgg,
    testMoma,
    servicios_mind: {
      clientesPorServicio,
      sesionesMind,
      conversion: conversionMind
    },
    incidencias,
    conversaciones,
    // KPIs de crecimiento
    crecimiento: {
      activos: activos.length,
      altasMes: serieMensual[serieMensual.length - 1].altas,
      bajasMes: serieMensual[serieMensual.length - 1].bajas,
      neto: serieMensual[serieMensual.length - 1].neto,
      permanenciaMedia: (activos.reduce((a, c) => a + c.permanenciaMeses, 0) / activos.length).toFixed(1),
      listaEspera: listaEspera.length
    }
  };

  DATA.valorPorCliente = {
    ingresoMedio: Math.round(facturacionTotal / activos.length),
    serviciosPorCliente: (activos.reduce((a, c) => a + c.servicios.length, 0) / activos.length).toFixed(1)
  };

  global.MOMA_DATA = DATA;

  // Utilidad para leer conversaciones generadas por el chatbot en vivo (localStorage)
  global.MOMA_getConversaciones = function () {
    let live = [];
    try {
      live = JSON.parse(localStorage.getItem('moma_conversaciones') || '[]');
    } catch (e) { live = []; }
    return live.concat(DATA.conversaciones);
  };

})(window);
