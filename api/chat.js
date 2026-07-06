const serviceHints = {
  entrenamiento: "El entrenamiento personal en MOMA se trabaja con grupos reducidos, adaptación al nivel de cada persona y seguimiento técnico.",
  bodymind: "BodyMind está pensado para recuperación, relajación, movilidad y conexión cuerpo-mente.",
  nutrimind: "NutriMind acompaña los objetivos físicos desde nutrición consciente y hábitos sostenibles.",
  energymind: "EnergyMind se orienta a energía, movimiento consciente y bienestar.",
  mind360: "Mind360 trabaja desarrollo personal y bienestar emocional como complemento al entrenamiento."
};

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      endpoint: "/api/chat",
      demo: true,
      message: "Endpoint de chat demo para MOMA. Envia POST con { message, sessionId, history }."
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? safeJson(req.body) : req.body || {};
  const message = String(body.message || "").trim();
  const lower = normalize(message);

  if (!message) {
    return res.status(200).json({
      reply: "Hola, soy el asistente de MOMA. ¿Me indicas tu nombre y qué servicio te interesa?",
      intent: "Inicio",
      status: "Nuevo chat",
      nextAction: "Pedir nombre y servicio"
    });
  }

  const response = buildResponse(lower);
  return res.status(200).json({
    ...response,
    sessionId: body.sessionId || null,
    timestamp: new Date().toISOString(),
    demo: true
  });
};

function buildResponse(text) {
  if (containsAny(text, ["precio", "tarifa", "cuota", "coste", "pagar"])) {
    return {
      intent: "Precios",
      status: "Lead caliente",
      nextAction: "Enviar planes y agendar valoración",
      reply: "Para orientarte bien, el equipo necesita saber cuántos días quieres entrenar y si buscas solo entrenamiento o algún servicio complementario. Te puedo dejar como lead para que te contacten con la opción más adecuada."
    };
  }

  if (containsAny(text, ["horario", "plaza", "tarde", "mañana", "mediodia", "mediodía", "lista de espera"])) {
    return {
      intent: "Lista de espera",
      status: "Pendiente hueco",
      nextAction: "Revisar disponibilidad por franja y ofrecer hueco",
      reply: "Perfecto. Las plazas se gestionan por disponibilidad y preferencia horaria. Dime qué días puedes entrenar, si prefieres mañana, mediodía o tarde, y lo dejamos preparado para que el equipo revise huecos."
    };
  }

  if (containsAny(text, ["baja", "cancelar", "dejar", "pausar", "reserva"])) {
    return {
      intent: "Baja o reserva",
      status: "Seguimiento administración",
      nextAction: "Enviar formulario de baja, reserva o modificación",
      reply: "Puedo ayudarte a dejarlo registrado. Indica si quieres baja, reserva de plaza o cambio de horario, y el equipo lo revisará para actualizar tu ficha y la planificación mensual."
    };
  }

  if (containsAny(text, ["bodymind", "nutrimind", "energymind", "mind360", "mind", "nutricion", "nutrición"])) {
    const service = detectService(text);
    return {
      intent: "Servicios Mind",
      status: "Cita valoración",
      nextAction: "Agendar valoración de servicio complementario",
      reply: `${serviceHints[service] || "MOMA combina entrenamiento, bienestar y servicios complementarios."} Si quieres, dime tu objetivo principal y tu horario preferido para que el equipo te proponga la mejor combinación.`
    };
  }

  if (containsAny(text, ["lesion", "lesión", "dolor", "limitacion", "limitación", "recuperacion", "recuperación"])) {
    return {
      intent: "Adaptación por lesión",
      status: "Cita valoración",
      nextAction: "Agendar valoración inicial con entrenador",
      reply: "En MOMA adaptan el entrenamiento al nivel y a posibles limitaciones. Para hacerlo con seguridad, lo ideal es una valoración inicial. Dime qué te ocurre y en qué horario podrías venir."
    };
  }

  if (containsAny(text, ["hola", "buenas", "informacion", "información", "apuntarme", "alta"])) {
    return {
      intent: "Alta",
      status: "Nuevo lead",
      nextAction: "Pedir datos de contacto y preferencia horaria",
      reply: "Genial. Para ayudarte con el alta necesito nombre, teléfono o email, servicio que te interesa y horario preferido. Con eso el equipo puede revisar disponibilidad y contactarte."
    };
  }

  return {
    intent: "Consulta inicial",
    status: "Nuevo chat",
    nextAction: "Revisar conversación desde CRM",
    reply: "Gracias por contarme. Para que el equipo de MOMA pueda ayudarte, dime tu nombre, teléfono o email, el servicio que te interesa y tu horario preferido."
  };
}

function containsAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function detectService(text) {
  if (text.includes("bodymind")) return "bodymind";
  if (text.includes("nutrimind") || text.includes("nutricion") || text.includes("nutrición")) return "nutrimind";
  if (text.includes("energymind")) return "energymind";
  if (text.includes("mind360")) return "mind360";
  if (text.includes("entren")) return "entrenamiento";
  return "entrenamiento";
}

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function safeJson(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return {};
  }
}
