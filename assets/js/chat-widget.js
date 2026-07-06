/* =============================================================
   MOMA CRM — Widget del chatbot (cliente)
   -------------------------------------------------------------
   Habla con /api/chat y guarda la conversación en localStorage
   para que aparezca en el panel del CRM (Conversaciones).
   ============================================================= */
(function () {
  'use strict';

  const bubble = document.getElementById('chatBubble');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const body = document.getElementById('chatBody');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');

  const SALUDO = 'Hola, soy el asistente de MOMA. Para atenderte mejor, ¿me indicas tu nombre completo?';

  let mensajes = [];          // {from, text, hora}
  let nombre = '';            // nombre capturado
  let telefono = '';          // teléfono detectado
  let estado = 'Nueva';       // estado de la conversación
  const convId = 'CVL' + Math.random().toString(36).slice(2, 8) + '-' + horaCompacta();

  function hora() {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  function horaCompacta() {
    const d = new Date();
    return '' + d.getHours() + d.getMinutes() + d.getSeconds();
  }
  function hoy() {
    return new Date().toISOString().slice(0, 10);
  }

  function pintar(from, text) {
    const div = document.createElement('div');
    div.className = 'msg ' + from;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function typing(on) {
    let t = document.getElementById('typingIndicator');
    if (on && !t) {
      t = document.createElement('div');
      t.id = 'typingIndicator';
      t.className = 'typing';
      t.innerHTML = '<i></i><i></i><i></i>';
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
    } else if (!on && t) {
      t.remove();
    }
  }

  function guardar() {
    // upsert de la conversación en localStorage para el CRM
    let arr = [];
    try { arr = JSON.parse(localStorage.getItem('moma_conversaciones') || '[]'); } catch (e) { arr = []; }
    arr = arr.filter((c) => c.id !== convId);
    arr.unshift({
      id: convId,
      nombre: nombre || 'Visitante web',
      telefono: telefono || '—',
      canal: 'Chatbot web',
      fecha: hoy(),
      estado: estado,
      etiqueta: estado === 'Baja solicitada' || estado === 'Impago' ? 'Cliente' : 'Lead',
      mensajes: mensajes.slice()
    });
    // limita a 40 conversaciones en vivo
    localStorage.setItem('moma_conversaciones', JSON.stringify(arr.slice(0, 40)));
  }

  function detectarTelefono(txt) {
    const m = (txt.match(/(\+?\d[\d\s]{7,}\d)/) || [])[0];
    if (m) telefono = m.trim();
  }

  async function enviarAlServidor() {
    typing(true);
    sendBtn.disabled = true;
    let data;
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: mensajes, name: nombre })
      });
      data = await resp.json();
    } catch (e) {
      data = fallback();
    }
    typing(false);
    sendBtn.disabled = false;
    if (data.name) nombre = data.name;
    if (data.estado) estado = data.estado;
    const reply = data.reply || fallback().reply;
    mensajes.push({ from: 'bot', text: reply, hora: hora() });
    pintar('bot', reply);
    guardar();
    input.focus();
  }

  // Respuesta de reserva por si /api no está disponible (p.ej. abierto como archivo local)
  function extraerNombre(txt) {
    let s = (txt || '').trim();
    s = s.replace(/^(hola|buenas|buenos dias|buenos días|buenas tardes|buenas noches|hey|hi|holaa+|que tal|qué tal)[\s,!.¡]*/i, '');
    s = s.replace(/^(me llamo|mi nombre es|yo soy|soy)[\s]+/i, '');
    s = s.replace(/[.,!¡¿?]+$/g, '').trim();
    return s.split(/\s+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  function fallback() {
    if (!nombre) {
      const ultimo = [...mensajes].reverse().find((m) => m.from === 'user');
      const posible = ultimo ? ultimo.text.trim() : '';
      if (posible && posible.length <= 40 && !/[?¿]/.test(posible)) {
        const n = extraerNombre(posible);
        if (n && n.length >= 2) {
          nombre = n;
          return { reply: '¡Un placer, ' + nombre.split(' ')[0] + '! ¿En qué puedo ayudarte? Puedes preguntarme por entrenamiento, precios, horarios o nuestros servicios.', estado: 'Nueva' };
        }
      }
    }
    return { reply: 'Gracias por tu mensaje. Puedo ayudarte con entrenamiento, precios, horarios, servicios Mind/Nutrición, altas o bajas. Déjame tu teléfono y te llamamos en menos de 48h.', estado: 'Cita solicitada' };
  }

  function iniciar() {
    if (mensajes.length) return;
    mensajes.push({ from: 'bot', text: SALUDO, hora: hora() });
    pintar('bot', SALUDO);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const txt = input.value.trim();
    if (!txt) return;
    input.value = '';
    detectarTelefono(txt);
    mensajes.push({ from: 'user', text: txt, hora: hora() });
    pintar('user', txt);
    guardar();
    enviarAlServidor();
  });

  function abrir() { panel.classList.add('open'); bubble.style.display = 'none'; iniciar(); input.focus(); }
  function cerrar() { panel.classList.remove('open'); bubble.style.display = 'grid'; }

  bubble.addEventListener('click', abrir);
  closeBtn.addEventListener('click', cerrar);

  // abrir automáticamente tras un instante (como en el ejemplo)
  setTimeout(abrir, 600);
})();
