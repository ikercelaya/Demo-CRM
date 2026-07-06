/* =============================================================
   MOMA CRM — Endpoint del chatbot (Vercel Serverless Function)
   -------------------------------------------------------------
   Asistente conversacional sencillo, basado en reglas (sin IA
   externa ni claves de API), pensado para la demo. Recibe el
   historial de mensajes y devuelve la respuesta del asistente.

   POST /api/chat
   body: { messages: [{from:'user'|'bot', text}], name: string }
   ->    { reply, name, estado }
   ============================================================= */

const normaliza = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const contiene = (t, arr) => arr.some((k) => t.includes(k));

// Motor de intención basado en palabras clave
function responder(texto, nombre) {
  const t = normaliza(texto);
  const n = nombre ? nombre.split(' ')[0] : '';
  const saludo = n ? n : '';

  // Detección de teléfono
  const tel = (texto.match(/(\+?\d[\d\s]{7,}\d)/) || [])[0];

  if (contiene(t, ['precio', 'precios', 'cuesta', 'tarifa', 'cuota', 'cuanto vale', 'coste', 'pagar al mes'])) {
    return {
      reply:
        'Trabajamos con cuotas mensuales según los días de entrenamiento por semana (2, 3, 4 días o modalidad libre), con entrenador asignado y grupos reducidos. A partir de ahí puedes añadir servicios como Nutrición, BodyMind o Mindfulness. ¿Quieres que una persona del equipo te llame para darte el detalle y ver disponibilidad?',
      estado: 'Cita solicitada'
    };
  }
  if (contiene(t, ['horario', 'abre', 'abren', 'a que hora', 'que hora', 'abierto'])) {
    return {
      reply:
        'Abrimos de lunes a viernes de 07:00 a 22:00 y sábados de 09:00 a 14:00. Las clases son en grupos reducidos por franjas (mañana, mediodía y tarde). ¿Qué franja te encajaría mejor?',
      estado: 'Nueva'
    };
  }
  if (contiene(t, ['apunt', 'inscrib', 'alta', 'registr', 'empezar', 'unirme', 'probar', 'prueba', 'plaza', 'quiero entrenar', 'informacion'])) {
    return {
      reply:
        `${saludo ? '¡Genial, ' + saludo + '! ' : '¡Genial! '}Ahora mismo trabajamos con grupos reducidos y a veces hay lista de espera por franjas. Puedo dejarte anotado/a en la lista de espera y reservarte una sesión de valoración gratuita. ¿Me confirmas un teléfono de contacto y la franja que prefieres (mañana / mediodía / tarde)?`,
      estado: 'Cita solicitada'
    };
  }
  if (contiene(t, ['nutric', 'dieta', 'comer', 'alimenta'])) {
    return {
      reply:
        'El servicio de Nutrición incluye un plan personalizado y seguimiento con nuestra nutricionista, y se puede combinar con el entrenamiento. ¿Quieres que te contacte para una primera valoración?',
      estado: 'Cita solicitada'
    };
  }
  if (contiene(t, ['mindful', 'mind', 'medita', 'bodymind', 'body mind', 'yoga', 'bowspring', 'estres', 'relaj'])) {
    return {
      reply:
        'Nuestra zona Mind ofrece Mindfulness, grupos de desarrollo y BowSpring: sesiones reducidas con colaboradoras especializadas para trabajar movilidad, respiración y gestión del estrés. ¿Te reservo una sesión de prueba?',
      estado: 'Cita solicitada'
    };
  }
  if (contiene(t, ['reserva plaza', 'reservar plaza', 'congelar', 'reservar mi plaza', 'guardar plaza', 'me voy de viaje', 'vacaciones'])) {
    return {
      reply:
        'Puedes reservar tu plaza un máximo de 2 meses al año. Dejo registrada tu solicitud y administración te confirmará las fechas. ¿Para qué mes lo necesitas?',
      estado: 'Cita solicitada'
    };
  }
  if (contiene(t, ['cambiar horario', 'cambio de horario', 'cambio horario', 'modificar', 'otro horario', 'cambiar mi hora', 'aumentar dias', 'reducir dias'])) {
    return {
      reply:
        'Puedo tramitar tu cambio de horario o de días de entrenamiento. ¿Qué cambio necesitas y a partir de qué día? Tu entrenador lo confirmará.',
      estado: 'Cita solicitada'
    };
  }
  if (contiene(t, ['baja', 'darme de baja', 'cancelar', 'dar de baja', 'anular'])) {
    return {
      reply:
        `Lamento que quieras dejarnos${saludo ? ', ' + saludo : ''}. Puedo registrar tu solicitud de baja. ¿Me indicas el motivo (mudanza, lesión, precio, falta de tiempo u otros)? Administración te confirmará la fecha efectiva.`,
      estado: 'Baja solicitada'
    };
  }
  if (contiene(t, ['ubica', 'donde estais', 'donde estan', 'direccion', 'como llego', 'donde os encuentro'])) {
    return {
      reply:
        'Estamos en el centro MOMA. Puedes ver la dirección exacta y cómo llegar en nuestra web www.momaep.es. ¿Quieres que te reserve una visita para conocer las instalaciones?',
      estado: 'Nueva'
    };
  }
  if (contiene(t, ['recibo', 'impago', 'factura', 'devuelto', 'pago pendiente', 'no me han cobrado', 'cobro'])) {
    return {
      reply:
        'Puedo avisar a administración para revisar tu recibo. Podrás regularizarlo en recepción o por transferencia. ¿Quieres que te contacten con los detalles?',
      estado: 'Impago'
    };
  }
  if (tel) {
    return {
      reply:
        `¡Perfecto! He anotado tu teléfono ${tel}. Te contactamos en menos de 48h para darte disponibilidad y cerrar tu sesión de valoración. ¿Hay algo más en lo que pueda ayudarte?`,
      estado: 'Cita solicitada'
    };
  }
  if (contiene(t, ['gracias', 'nada mas', 'perfecto', 'ok', 'vale', 'genial', 'de acuerdo'])) {
    return {
      reply: `¡A ti${saludo ? ', ' + saludo : ''}! Cualquier cosa aquí me tienes. Te esperamos en MOMA 💪`,
      estado: 'Resuelta'
    };
  }
  // fallback
  return {
    reply:
      `Puedo ayudarte con información sobre entrenamiento, precios, horarios, servicios Mind/Nutrición, altas, cambios de horario o bajas. ${saludo ? saludo + ', ¿' : '¿'}qué necesitas exactamente? Si lo prefieres, déjame tu teléfono y te llamamos.`,
    estado: 'Nueva'
  };
}

// Extrae un nombre a partir de frases como "Hola, soy Laura Gómez"
function extraerNombre(txt) {
  let s = (txt || '').trim();
  s = s.replace(/^(hola|buenas|buenos dias|buenos días|buenas tardes|buenas noches|hey|hi|holaa+|que tal|qué tal)[\s,!.¡]*/i, '');
  s = s.replace(/^(me llamo|mi nombre es|yo soy|soy)[\s]+/i, '');
  s = s.replace(/[.,!¡¿?]+$/g, '').trim();
  // Capitaliza cada palabra
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function procesar(body) {
  const messages = Array.isArray(body.messages) ? body.messages : [];
  let name = (body.name || '').trim();
  const userMsgs = messages.filter((m) => m && m.from === 'user');
  const lastUser = userMsgs.length ? userMsgs[userMsgs.length - 1].text : '';

  // Primera intervención del usuario: se interpreta como su nombre
  if (!name) {
    const posible = (lastUser || '').trim();
    // Si trae una pregunta/palabra clave clara, respondemos a la intención sin exigir nombre
    const t = normaliza(posible);
    const esPregunta = /[?¿]/.test(posible);
    const pareceIntencion = contiene(t, ['precio', 'horario', 'apunt', 'inscrib', 'nutric', 'mindful', 'baja', 'reserva', 'ubica', 'clase']);
    if (posible && !esPregunta && !pareceIntencion && posible.length <= 40) {
      name = extraerNombre(posible);
      if (name && name.length >= 2) {
        return {
          reply: `¡Un placer, ${name.split(' ')[0]}! ¿En qué puedo ayudarte? Puedes preguntarme por entrenamiento, precios, horarios o nuestros servicios (Nutrición, BodyMind, Mindfulness).`,
          name,
          estado: 'Nueva'
        };
      }
    }
    // Si preguntó algo directamente o no dio un nombre válido
    const r = responder(lastUser, '');
    return { reply: r.reply, name: '', estado: r.estado };
  }

  const r = responder(lastUser, name);
  return { reply: r.reply, name, estado: r.estado };
}

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Método no permitido. Usa POST.' }));
    return;
  }
  let body = req.body;
  try {
    if (typeof body === 'string') body = JSON.parse(body || '{}');
    if (!body) body = {};
  } catch (e) {
    body = {};
  }
  const out = procesar(body);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(out));
};

// Exportado para pruebas locales en Node
module.exports.procesar = procesar;
module.exports.responder = responder;
