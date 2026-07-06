(function () {
  const STORAGE_KEY = "moma-demo-conversations";
  const SESSION_KEY = "moma-chat-session-id";
  const messagesNode = document.getElementById("chatMessages");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const widget = document.getElementById("chatWidget");
  const bubble = document.getElementById("chatBubble");
  const close = document.getElementById("closeChat");

  let conversation = loadOrCreateConversation();

  document.addEventListener("DOMContentLoaded", () => {
    renderMessages();
  });

  bubble.addEventListener("click", () => widget.classList.add("open"));
  close.addEventListener("click", () => widget.classList.remove("open"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    addMessage("client", message);
    input.value = "";
    input.disabled = true;

    const reply = await askAssistant(message);
    addMessage("bot", reply.reply);
    conversation.intent = reply.intent || conversation.intent || "Consulta";
    conversation.status = reply.status || "Nuevo chat";
    conversation.profile.nextStep = reply.nextAction || "Revisar desde el CRM";
    updateClientName(message);
    saveConversation();
    input.disabled = false;
    input.focus();
  });

  function loadOrCreateConversation() {
    const sessionId = sessionStorage.getItem(SESSION_KEY) || `web-${Date.now()}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
    const stored = readStored();
    const existing = stored.find((item) => item.id === sessionId);
    if (existing) return existing;

    const created = {
      id: sessionId,
      clientName: "Visitante web",
      channel: "Chat web",
      status: "Nuevo chat",
      intent: "Consulta inicial",
      lastMessage: "Inicio de conversación",
      updatedAt: formatNow(),
      profile: {
        phone: "Pendiente",
        email: "Pendiente",
        source: "Chat público",
        nextStep: "Pedir nombre, horario y servicio"
      },
      messages: [
        {
          role: "bot",
          text: "Hola, soy el asistente de MOMA. Puedo ayudarte con entrenamiento personal, BodyMind, NutriMind, EnergyMind, Mind360, horarios o lista de espera. ¿Me indicas tu nombre y qué necesitas?"
        }
      ]
    };
    writeStored([created, ...stored]);
    return created;
  }

  async function askAssistant(message) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: conversation.id,
          message,
          history: conversation.messages
        })
      });
      if (!response.ok) throw new Error("Chat endpoint unavailable");
      return await response.json();
    } catch (error) {
      return localReply(message);
    }
  }

  function addMessage(role, text) {
    conversation.messages.push({ role, text });
    conversation.lastMessage = text;
    conversation.updatedAt = formatNow();
    saveConversation();
    renderMessages();
  }

  function renderMessages() {
    messagesNode.innerHTML = conversation.messages.map((message) => `
      <div class="message ${message.role === "client" ? "client" : "bot"}">${escapeHtml(message.text)}</div>
    `).join("");
    messagesNode.scrollTop = messagesNode.scrollHeight;
  }

  function saveConversation() {
    const stored = readStored();
    const next = [conversation, ...stored.filter((item) => item.id !== conversation.id)];
    writeStored(next);
  }

  function updateClientName(message) {
    if (conversation.clientName !== "Visitante web") return;
    const match = message.match(/(?:soy|me llamo|mi nombre es)\s+([a-záéíóúñü]+(?:\s+[a-záéíóúñü]+)?)/i);
    if (match) {
      conversation.clientName = titleCase(match[1]);
    }
  }

  function localReply(message) {
    const text = message.toLowerCase();
    if (text.includes("precio") || text.includes("tarifa") || text.includes("cuota")) {
      return {
        intent: "Precios",
        status: "Lead caliente",
        nextAction: "Enviar información de planes y agendar valoración",
        reply: "Para darte un precio ajustado necesitamos saber días por semana, objetivo y si quieres añadir servicios como NutriMind o BodyMind. Te puedo dejar anotado para que el equipo te contacte."
      };
    }
    if (text.includes("horario") || text.includes("tarde") || text.includes("mañana") || text.includes("plaza")) {
      return {
        intent: "Lista de espera",
        status: "Pendiente hueco",
        nextAction: "Revisar disponibilidad por franja",
        reply: "Perfecto. Ahora mismo la tarde suele tener más demanda y se gestiona con lista de espera. Dime qué días puedes y lo dejamos preparado para ofrecerte hueco."
      };
    }
    if (text.includes("nutri") || text.includes("mind") || text.includes("body")) {
      return {
        intent: "Servicios Mind",
        status: "Cita valoración",
        nextAction: "Agendar valoración de servicio complementario",
        reply: "Además del entrenamiento, MOMA trabaja servicios como BodyMind, NutriMind, EnergyMind y Mind360. Si me dices qué buscas, el equipo puede proponerte la mejor combinación."
      };
    }
    return {
      intent: "Consulta inicial",
      status: "Nuevo chat",
      nextAction: "Pedir datos de contacto",
      reply: "Gracias. Para pasarlo al equipo necesito nombre, teléfono o email, servicio que te interesa y horario preferido. Con eso podrán contactarte y revisar disponibilidad."
    };
  }

  function readStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeStored(conversations) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }

  function formatNow() {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date());
  }

  function titleCase(value) {
    return value
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
