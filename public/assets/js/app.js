(function () {
  const DATA = window.MOMA_DEMO_DATA;
  const STORAGE_KEY = "moma-demo-conversations";
  const SESSION_KEY = "moma-demo-session";
  const titles = {
    dashboard: ["Dirección", "Cuadro de mando"],
    clients: ["CRM", "Clientes"],
    leads: ["Captación", "Leads y altas"],
    schedule: ["Operaciones", "Horarios y ocupación"],
    team: ["Equipo", "Rendimiento"],
    billing: ["Administración", "Facturación"],
    profit: ["Dirección", "Rentabilidad"],
    services: ["Ecosistema", "Servicios MOMA"],
    results: ["Usuarios", "Test MOMA"],
    resources: ["Centro", "Recursos e inventario"],
    quality: ["Operaciones", "Calidad y checklists"],
    calendar: ["Centro", "Calendario"],
    incidents: ["Operaciones", "Incidencias"],
    conversations: ["Comunicación", "Conversaciones"],
    automations: ["Sistema", "Automatizaciones"]
  };

  let activeConversationId = null;

  document.addEventListener("DOMContentLoaded", () => {
    bindShell();
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      showApp();
    }
  });

  function bindShell() {
    document.getElementById("loginForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const isValid = email === DATA.credentials.email && password === DATA.credentials.password;
      document.getElementById("loginError").hidden = isValid;
      if (isValid) {
        sessionStorage.setItem(SESSION_KEY, "true");
        showApp();
      }
    });

    document.querySelectorAll(".nav-item").forEach((button) => {
      button.addEventListener("click", () => showView(button.dataset.view));
    });

    document.getElementById("logoutButton").addEventListener("click", () => {
      sessionStorage.removeItem(SESSION_KEY);
      document.getElementById("appShell").hidden = true;
      document.getElementById("loginView").hidden = false;
    });
  }

  function showApp() {
    document.getElementById("loginView").hidden = true;
    document.getElementById("appShell").hidden = false;
    renderAll();
    showView("dashboard");
  }

  function showView(viewId) {
    document.querySelectorAll(".view").forEach((view) => view.classList.remove("active-view"));
    document.getElementById(viewId).classList.add("active-view");
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.view === viewId);
    });
    document.getElementById("sectionKicker").textContent = titles[viewId][0];
    document.getElementById("sectionTitle").textContent = titles[viewId][1];
    if (viewId === "conversations") {
      renderConversations();
    }
  }

  function renderAll() {
    renderDashboard();
    renderClients();
    renderLeads();
    renderSchedule();
    renderTeam();
    renderBilling();
    renderProfit();
    renderServices();
    renderResults();
    renderResources();
    renderQuality();
    renderCalendar();
    renderIncidents();
    renderConversations();
    renderAutomations();
  }

  function renderDashboard() {
    document.getElementById("dashboardKpis").innerHTML = DATA.kpis.map((kpi) => `
      <article class="metric-card">
        <span>${escapeHtml(kpi.label)}</span>
        <strong>${formatMetric(kpi.value, kpi.suffix)}</strong>
        <small><b class="trend">${escapeHtml(kpi.trend)}</b> · ${escapeHtml(kpi.hint)}</small>
      </article>
    `).join("");

    renderLineChart("usersLineChart", DATA.monthly.map((item) => ({
      label: item.month,
      value: item.users
    })));

    document.getElementById("growthBarChart").innerHTML = renderPairedBars(DATA.monthly, "altas", "bajas");
    document.getElementById("alertList").innerHTML = DATA.alerts.map((alert) => `
      <div class="alert-item ${escapeHtml(alert.type)}">
        <strong>${escapeHtml(alert.title)}</strong>
        <span>${escapeHtml(alert.detail)}</span>
      </div>
    `).join("");

    document.getElementById("flowSteps").innerHTML = DATA.flow.map((step, index) => `
      <div class="flow-step">
        <strong>${index + 1}. ${escapeHtml(step.title)}</strong>
        <p>${escapeHtml(step.text)}</p>
      </div>
    `).join("");
  }

  function renderClients() {
    const active = DATA.clients.filter((client) => client.status === "Activo").length;
    const atRisk = DATA.clients.filter((client) => client.risk === "Alto").length;
    const avgAttendance = average(DATA.clients.map((client) => client.attendance));
    const totalLtv = sum(DATA.clients.map((client) => client.ltv));

    setView("clients", `
      ${sectionIntro("Base de clientes", "Ficha rápida de clientes, servicios contratados, entrenador asignado, asistencia y riesgo de baja. En una implementación real esto vendría del alta, reservas, APP MOMA y facturación.")}
      ${statsRow([
        ["Activos en muestra", active],
        ["Riesgo alto", atRisk],
        ["Asistencia media", `${Math.round(avgAttendance)}%`],
        ["Valor acumulado", money(totalLtv)]
      ])}
      <article class="panel">
        <div class="panel-heading">
          <div><p class="eyebrow">Clientes</p><h3>Listado operativo</h3></div>
          <span class="status-pill positive">${DATA.clients.length} registros demo</span>
        </div>
        ${table(
          ["Cliente", "Estado", "Entrenador", "Servicios", "Plan", "Desde", "Asistencia", "Riesgo", "LTV"],
          DATA.clients.map((client) => [
            client.name,
            status(client.status),
            client.trainer,
            tags(client.services),
            client.plan,
            dateShort(client.since),
            progress(client.attendance),
            risk(client.risk),
            money(client.ltv)
          ])
        )}
      </article>
    `);
  }

  function renderLeads() {
    const conversion = Math.round((31 / (31 + DATA.leads.length)) * 100);
    setView("leads", `
      ${sectionIntro("Captación y lista de espera", "Vista pensada para sustituir el seguimiento manual de formularios. Prioriza leads por origen, horario preferido, días de espera y probabilidad de alta.")}
      ${statsRow([
        ["Leads generados", 118],
        ["Clientes nuevos", 31],
        ["Conversión", `${conversion}%`],
        ["Espera media", "6 días"]
      ])}
      <div class="content-grid">
        <article class="panel wide">
          <div class="panel-heading">
            <div><p class="eyebrow">Lista de espera</p><h3>Personas interesadas</h3></div>
            <span class="status-pill warn">39 esperando plaza</span>
          </div>
          ${table(
            ["Lead", "Origen", "Servicio", "Preferencia", "Estado", "Días espera", "Score"],
            DATA.leads.map((lead) => [
              lead.name,
              lead.origin,
              lead.service,
              lead.preferred,
              status(lead.status),
              lead.daysWaiting,
              progress(lead.score)
            ])
          )}
        </article>
        <article class="panel">
          <div class="panel-heading"><div><p class="eyebrow">Marketing</p><h3>Origen de clientes</h3></div></div>
          ${horizontalBars(DATA.leadSources, "value", "%")}
        </article>
        <article class="panel">
          <div class="panel-heading"><div><p class="eyebrow">Formularios</p><h3>Entradas simuladas</h3></div></div>
          <div class="alert-list">
            <div class="alert-item positive"><strong>Lista de espera</strong><span>Crea lead, origen y horario preferido.</span></div>
            <div class="alert-item positive"><strong>Alta</strong><span>Genera ficha, servicio, entrenador y cuota.</span></div>
            <div class="alert-item warn"><strong>Cambios de horario</strong><span>Actualiza reservas y ocupación.</span></div>
            <div class="alert-item danger"><strong>Baja</strong><span>Registra motivo, valoración y entrenador.</span></div>
          </div>
        </article>
      </div>
    `);
  }

  function renderSchedule() {
    const fullClasses = DATA.schedule.filter((item) => item.booked === item.capacity).length;
    const lowClasses = DATA.schedule.filter((item) => item.booked / item.capacity < 0.6).length;
    const capacity = sum(DATA.schedule.map((item) => item.capacity));
    const booked = sum(DATA.schedule.map((item) => item.booked));

    setView("schedule", `
      ${sectionIntro("Planning y ocupación", "Resumen del planning semanal para detectar huecos libres, clases llenas, franjas infrautilizadas y oportunidades de redistribución.")}
      ${statsRow([
        ["Plazas muestra", capacity],
        ["Reservas", booked],
        ["Ocupación", `${Math.round((booked / capacity) * 100)}%`],
        ["Clases llenas", fullClasses]
      ])}
      <div class="content-grid">
        <article class="panel wide">
          <div class="panel-heading">
            <div><p class="eyebrow">Planning</p><h3>Clases por horario</h3></div>
            <span class="status-pill danger">${lowClasses} con baja ocupación</span>
          </div>
          ${table(
            ["Día", "Hora", "Entrenador", "Zona", "Reservas", "Ocupación"],
            DATA.schedule.map((item) => {
              const occ = Math.round((item.booked / item.capacity) * 100);
              return [item.day, item.time, item.trainer, item.zone, `${item.booked}/${item.capacity}`, progress(occ)];
            })
          )}
        </article>
        <article class="panel">
          <div class="panel-heading"><div><p class="eyebrow">Por franja</p><h3>Ocupación media</h3></div></div>
          ${horizontalBars(DATA.occupancyBySlot, "value", "%")}
        </article>
        <article class="panel">
          <div class="panel-heading"><div><p class="eyebrow">Optimización</p><h3>Lecturas rápidas</h3></div></div>
          <div class="alert-list">
            <div class="alert-item warn"><strong>Mediodía tiene margen</strong><span>Conviene ofrecer 14:00 y 15:00 a leads con flexibilidad.</span></div>
            <div class="alert-item positive"><strong>Tarde al límite</strong><span>Crear lista priorizada para huecos de 18:00 a 20:00.</span></div>
            <div class="alert-item warn"><strong>Coste por hora pendiente</strong><span>La demo deja preparado el cruce con nóminas.</span></div>
          </div>
        </article>
      </div>
    `);
  }

  function renderTeam() {
    setView("team", `
      ${sectionIntro("Rendimiento del equipo", "Datos por entrenador: clases impartidas, ocupación, usuarios, bajas, valoración y cumplimiento de protocolos.")}
      ${statsRow([
        ["Entrenadores", DATA.trainers.length],
        ["Clases impartidas", sum(DATA.trainers.map((trainer) => trainer.classes))],
        ["Valoración media", average(DATA.trainers.map((trainer) => trainer.rating)).toFixed(1)],
        ["Bajas asociadas", sum(DATA.trainers.map((trainer) => trainer.cancellations))]
      ])}
      <div class="content-grid">
        <article class="panel">
          <div class="panel-heading"><div><p class="eyebrow">Ocupación</p><h3>Por entrenador</h3></div></div>
          ${horizontalBars(DATA.trainers.map((trainer) => ({ label: trainer.name, value: trainer.occupancy })), "value", "%")}
        </article>
        <article class="panel">
          <div class="panel-heading"><div><p class="eyebrow">Bajas</p><h3>Usuarios perdidos</h3></div></div>
          ${horizontalBars(DATA.trainers.map((trainer) => ({ label: trainer.name, value: trainer.cancellations })), "value", "", 10)}
        </article>
        <article class="panel wide">
          <div class="panel-heading"><div><p class="eyebrow">Equipo</p><h3>Tabla de control</h3></div></div>
          ${table(
            ["Entrenador", "Clases", "Ocupación", "Usuarios", "Bajas", "Valoración", "Protocolos", "Coste nómina"],
            DATA.trainers.map((trainer) => [
              trainer.name,
              trainer.classes,
              progress(trainer.occupancy),
              trainer.users,
              trainer.cancellations,
              `${trainer.rating.toFixed(1)}/5`,
              progress(trainer.protocol),
              money(trainer.payrollCost)
            ])
          )}
        </article>
      </div>
    `);
  }

  function renderBilling() {
    setView("billing", `
      ${sectionIntro("Facturación", "Facturación total, desglose por servicio, facturas de prueba e impagos para que administración pueda actuar antes de una baja.")}
      ${statsRow([
        ["Facturación total", money(62480)],
        ["Entrenamiento", money(42460)],
        ["Impagos", "7"],
        ["Ticket medio", money(192)]
      ])}
      <div class="content-grid">
        <article class="panel">
          <div class="panel-heading"><div><p class="eyebrow">Servicios</p><h3>Facturación por área</h3></div></div>
          ${horizontalBars(DATA.revenueByService, "value", "€")}
        </article>
        <article class="panel">
          <div class="panel-heading"><div><p class="eyebrow">Mensual</p><h3>Evolución facturación</h3></div></div>
          <div id="revenueLineChart" class="chart-area"></div>
        </article>
        <article class="panel wide">
          <div class="panel-heading"><div><p class="eyebrow">Facturas</p><h3>Últimos movimientos</h3></div></div>
          ${table(
            ["Número", "Cliente", "Servicio", "Importe", "Estado", "Fecha"],
            DATA.invoices.map((invoice) => [
              invoice.number,
              invoice.client,
              invoice.service,
              money(invoice.amount),
              status(invoice.status),
              dateShort(invoice.date)
            ])
          )}
        </article>
      </div>
    `);
    renderLineChart("revenueLineChart", DATA.monthly.map((item) => ({
      label: item.month,
      value: item.revenue
    })), true);
  }

  function renderProfit() {
    const totalExpenses = sum(DATA.expenses.map((item) => item.value));
    const revenue = 62480;
    const profit = revenue - totalExpenses;
    const margin = Math.round((profit / revenue) * 100);
    setView("profit", `
      ${sectionIntro("Rentabilidad del negocio", "Cruce de facturación, gastos, coste de personal, beneficio mensual, margen e ingreso medio por cliente.")}
      ${statsRow([
        ["Ingresos", money(revenue)],
        ["Gastos", money(totalExpenses)],
        ["Beneficio", money(profit)],
        ["Margen", `${margin}%`]
      ])}
      <div class="content-grid">
        <article class="panel">
          <div class="panel-heading"><div><p class="eyebrow">Gastos</p><h3>Por categoría</h3></div></div>
          ${horizontalBars(DATA.expenses, "value", "€")}
        </article>
        <article class="panel">
          <div class="panel-heading"><div><p class="eyebrow">Dirección</p><h3>Indicadores de valor</h3></div></div>
          <div class="service-grid">
            <div class="mini-card"><span>Permanencia media</span><strong>18,6 m</strong><p>Meses que permanece un cliente.</p></div>
            <div class="mini-card"><span>Servicios/cliente</span><strong>1,42</strong><p>Media de servicios contratados.</p></div>
            <div class="mini-card"><span>Coste personal</span><strong>${money(16980)}</strong><p>Dato de prueba para nóminas.</p></div>
            <div class="mini-card"><span>Beneficio/cliente</span><strong>${money(Math.round(profit / 326))}</strong><p>Rentabilidad media mensual.</p></div>
          </div>
        </article>
        <article class="panel wide">
          <div class="panel-heading"><div><p class="eyebrow">Histórico</p><h3>Ingresos y beneficio</h3></div></div>
          ${table(
            ["Mes", "Usuarios", "Facturación", "Beneficio", "Ocupación"],
            DATA.monthly.map((item) => [item.month, item.users, money(item.revenue), money(item.profit), `${item.occupancy}%`])
          )}
        </article>
      </div>
    `);
  }

  function renderServices() {
    setView("services", `
      ${sectionIntro("Servicios MOMA", "Seguimiento del ecosistema alrededor del entrenamiento: BodyMind, NutriMind, EnergyMind y Mind360.")}
      <div class="service-grid">
        ${DATA.services.map((service) => `
          <div class="mini-card">
            <span>${escapeHtml(service.name)}</span>
            <strong>${service.clients}</strong>
            <p>${service.occupancy}% ocupación · ${money(service.revenue)} · ${service.rating}/5</p>
          </div>
        `).join("")}
      </div>
      <div class="content-grid" style="margin-top:18px">
        <article class="panel">
          <div class="panel-heading"><div><p class="eyebrow">Clientes</p><h3>Por servicio</h3></div></div>
          ${horizontalBars(DATA.services.map((service) => ({ label: service.name, value: service.clients })), "value", "", 286)}
        </article>
        <article class="panel">
          <div class="panel-heading"><div><p class="eyebrow">Conversión</p><h3>Desde entrenamiento</h3></div></div>
          ${horizontalBars(DATA.services.filter((service) => service.name !== "Entrenamiento").map((service) => ({ label: service.name, value: service.conversion })), "value", "%")}
        </article>
        <article class="panel wide">
          <div class="panel-heading"><div><p class="eyebrow">Área Mind</p><h3>Detalle operativo</h3></div></div>
          ${table(
            ["Servicio", "Clientes activos", "Ocupación", "Conversión", "Facturación", "Valoración"],
            DATA.services.map((service) => [service.name, service.clients, `${service.occupancy}%`, `${service.conversion}%`, money(service.revenue), `${service.rating}/5`])
          )}
        </article>
      </div>
    `);
  }

  function renderResults() {
    setView("results", `
      ${sectionIntro("Resultados de los usuarios", "Resumen colectivo del Test MOMA. La demo muestra antes/después para enseñar cómo podrían generarse informes individuales y visión global.")}
      ${statsRow([
        ["Tests completados", 214],
        ["Mejora fuerza", "+16 pts"],
        ["Estrés medio", "-26 pts"],
        ["Sueño", "+18 pts"]
      ])}
      <article class="panel">
        <div class="panel-heading"><div><p class="eyebrow">Test MOMA</p><h3>Antes y después</h3></div></div>
        ${table(
          ["Variable", "Inicio", "Actual", "Cambio"],
          DATA.testResults.map((item) => {
            const change = item.after - item.before;
            const label = item.inverse ? `${Math.abs(change)} pts mejor` : `${change > 0 ? "+" : ""}${change} pts`;
            return [item.label, progress(item.before), progress(item.after), status(label)];
          })
        )}
      </article>
    `);
  }

  function renderResources() {
    setView("resources", `
      ${sectionIntro("Recursos del centro", "Inventario de material, consumibles, equipación y zona Mind para que coordinación haga recuento y contabilidad sepa cuándo comprar.")}
      ${statsRow([
        ["Artículos muestra", DATA.inventory.length],
        ["Bajo mínimo", DATA.inventory.filter((item) => item.stock < item.min).length],
        ["Última compra", "21 jun"],
        ["Responsables", "5"]
      ])}
      <article class="panel">
        <div class="panel-heading"><div><p class="eyebrow">Inventario</p><h3>Stock y compras</h3></div></div>
        ${table(
          ["Artículo", "Categoría", "Stock", "Mínimo", "Última compra", "Responsable", "Estado"],
          DATA.inventory.map((item) => [
            item.item,
            item.category,
            item.stock,
            item.min,
            dateShort(item.lastPurchase),
            item.owner,
            item.stock < item.min ? status("Comprar") : status("Correcto")
          ])
        )}
      </article>
    `);
  }

  function renderQuality() {
    setView("quality", `
      ${sectionIntro("Calidad y checklists", "Seguimiento de checklist de entrenadores, limpieza, administración y cumplimiento de protocolos con puntuación evolutiva.")}
      ${statsRow([
        ["Puntuación media", `${Math.round(average(DATA.checklists.map((item) => item.score)))}%`],
        ["Pendientes", DATA.checklists.filter((item) => item.status !== "Correcto").length],
        ["Protocolos equipo", "92%"],
        ["Limpieza centro", "96%"]
      ])}
      <div class="content-grid">
        <article class="panel">
          <div class="panel-heading"><div><p class="eyebrow">Puntuación</p><h3>Checklist activo</h3></div></div>
          ${horizontalBars(DATA.checklists.map((item) => ({ label: item.task, value: item.score })), "value", "%")}
        </article>
        <article class="panel">
          <div class="panel-heading"><div><p class="eyebrow">Control</p><h3>Tareas</h3></div></div>
          ${table(
            ["Área", "Tarea", "Score", "Responsable", "Estado"],
            DATA.checklists.map((item) => [item.area, item.task, progress(item.score), item.owner, status(item.status)])
          )}
        </article>
      </div>
    `);
  }

  function renderCalendar() {
    const days = Array.from({ length: 31 }, (_, index) => index + 1);
    setView("calendar", `
      ${sectionIntro("Calendario del centro", "Vista compacta para eventos, semanas de descarga, tests, vacaciones, bajas, asuntos propios y cierres administrativos.")}
      <article class="panel">
        <div class="panel-heading"><div><p class="eyebrow">Julio 2026</p><h3>Eventos clave</h3></div></div>
        <div class="calendar-grid">
          ${days.map((day) => {
            const events = DATA.events.filter((event) => event.day === day);
            return `
              <div class="day-cell">
                <strong>${day}</strong>
                ${events.map((event) => `<span class="event-chip">${escapeHtml(event.title)}</span>`).join("")}
              </div>
            `;
          }).join("")}
        </div>
      </article>
    `);
  }

  function renderIncidents() {
    const columns = ["Abierta", "En curso", "Resuelta"];
    setView("incidents", `
      ${sectionIntro("Registro de incidencias", "Tablero de incidencias para que los problemas no se pierdan en conversaciones sueltas y se pueda medir tiempo de resolución.")}
      <div class="kanban">
        ${columns.map((column) => `
          <div class="kanban-column">
            <h4>${column}</h4>
            ${DATA.incidents.filter((incident) => incident.status === column).map((incident) => `
              <div class="ticket">
                <strong>${escapeHtml(incident.title)}</strong>
                <p>${escapeHtml(incident.detail)}</p>
                <div><span class="priority ${incident.priority.toLowerCase()}">${incident.priority}</span> <span class="tag">${escapeHtml(incident.owner)}</span></div>
              </div>
            `).join("")}
          </div>
        `).join("")}
      </div>
    `);
  }

  function renderConversations() {
    const conversations = getConversations();
    if (!activeConversationId || !conversations.some((item) => item.id === activeConversationId)) {
      activeConversationId = conversations[0] ? conversations[0].id : null;
    }
    const active = conversations.find((item) => item.id === activeConversationId);

    setView("conversations", `
      ${sectionIntro("Conversaciones con clientes", "Panel único de chats web, WhatsApp y seguimiento interno. En la demo se mezcla información mock con chats creados desde /chat.html en este navegador.")}
      <div class="conversation-layout">
        <article class="panel">
          <div class="panel-heading">
            <div><p class="eyebrow">Inbox</p><h3>Chats</h3></div>
            <span class="status-pill">${conversations.length}</span>
          </div>
          <div class="conversation-list">
            ${conversations.map((conversation) => `
              <button class="conversation-item ${conversation.id === activeConversationId ? "active" : ""}" data-conversation="${escapeHtml(conversation.id)}">
                <strong>${escapeHtml(conversation.clientName)}</strong>
                <small>${escapeHtml(conversation.channel)} · ${escapeHtml(conversation.status)}</small>
                <span>${escapeHtml(conversation.lastMessage || "Sin mensajes")}</span>
              </button>
            `).join("")}
          </div>
        </article>
        <article class="panel">
          <div class="panel-heading">
            <div><p class="eyebrow">${active ? escapeHtml(active.intent) : "Chat"}</p><h3>${active ? escapeHtml(active.clientName) : "Sin conversación"}</h3></div>
            <span class="status-pill positive">Endpoint /api/chat</span>
          </div>
          <div class="conversation-thread">
            ${active ? active.messages.map((message) => `
              <div class="message ${messageClass(message.role)}">${escapeHtml(message.text)}</div>
            `).join("") : `<div class="empty-state">Todavía no hay conversaciones.</div>`}
          </div>
        </article>
        <article class="panel profile-panel">
          <div class="panel-heading"><div><p class="eyebrow">Ficha rápida</p><h3>Seguimiento</h3></div></div>
          ${active ? `
            <div class="profile-list">
              <div><span>Canal</span><strong>${escapeHtml(active.channel)}</strong></div>
              <div><span>Estado</span><strong>${escapeHtml(active.status)}</strong></div>
              <div><span>Teléfono</span><strong>${escapeHtml(active.profile?.phone || "Pendiente")}</strong></div>
              <div><span>Email</span><strong>${escapeHtml(active.profile?.email || "Pendiente")}</strong></div>
              <div><span>Origen</span><strong>${escapeHtml(active.profile?.source || "Chat web")}</strong></div>
              <div><span>Siguiente paso</span><strong>${escapeHtml(active.profile?.nextStep || "Revisar conversación")}</strong></div>
              <div><span>Última actividad</span><strong>${escapeHtml(active.updatedAt || "Ahora")}</strong></div>
            </div>
          ` : `<div class="empty-state">Abre el chat público y envía un mensaje para crear una conversación local.</div>`}
        </article>
      </div>
    `);

    document.querySelectorAll("[data-conversation]").forEach((button) => {
      button.addEventListener("click", () => {
        activeConversationId = button.dataset.conversation;
        renderConversations();
      });
    });
  }

  function renderAutomations() {
    setView("automations", `
      ${sectionIntro("Automatización propuesta", "Mapa de cómo fluiría la información desde formularios, APP MOMA, Virtuagym y contabilidad hasta el cuadro de mando. En esta demo todo es mock y no hay base de datos.")}
      ${statsRow([
        ["Fuentes simuladas", DATA.automations.length],
        ["Endpoint chat", "/api/chat"],
        ["Base de datos", "No usada"],
        ["Estado", "Demo lista"]
      ])}
      <article class="panel">
        <div class="panel-heading"><div><p class="eyebrow">Flujo de datos</p><h3>De formulario a métrica</h3></div></div>
        ${table(
          ["Entrada", "Módulo", "Estado demo", "Resultado"],
          DATA.automations.map((item) => [item.step, item.tool, status(item.status), item.result])
        )}
      </article>
    `);
  }

  function getConversations() {
    const stored = readStoredConversations();
    const merged = [...stored, ...DATA.conversations];
    return merged.map((conversation) => ({
      ...conversation,
      messages: normalizeMessages(conversation.messages || []),
      profile: conversation.profile || {}
    }));
  }

  function readStoredConversations() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function normalizeMessages(messages) {
    return messages.map((message) => ({
      role: message.role === "assistant" ? "bot" : message.role,
      text: message.text || message.content || ""
    }));
  }

  function messageClass(role) {
    if (role === "client" || role === "user") return "client";
    if (role === "staff") return "staff";
    return "bot";
  }

  function setView(id, html) {
    document.getElementById(id).innerHTML = html;
  }

  function sectionIntro(title, copy) {
    return `
      <div class="section-intro">
        <div>
          <p class="eyebrow">MOMA CRM</p>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(copy)}</p>
        </div>
      </div>
    `;
  }

  function statsRow(items) {
    return `
      <div class="stats-row">
        ${items.map(([label, value]) => `
          <div class="stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>
        `).join("")}
      </div>
    `;
  }

  function table(headers, rows) {
    return `
      <div class="table-wrap">
        <table>
          <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderLineChart(id, points, asMoney = false) {
    const container = document.getElementById(id);
    if (!container) return;
    const width = 760;
    const height = 270;
    const pad = 34;
    const values = points.map((point) => point.value);
    const min = Math.min(...values) * 0.96;
    const max = Math.max(...values) * 1.04;
    const bottom = height - pad;
    const scaleX = (index) => pad + (index * (width - pad * 2)) / (points.length - 1);
    const scaleY = (value) => bottom - ((value - min) / (max - min)) * (height - pad * 2);
    const coords = points.map((point, index) => [scaleX(index), scaleY(point.value), point]);
    const path = coords.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x},${y}`).join(" ");
    const fill = `M${coords[0][0]},${bottom} ${coords.map(([x, y]) => `L${x},${y}`).join(" ")} L${coords[coords.length - 1][0]},${bottom} Z`;
    container.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
        <path class="chart-fill" d="${fill}"></path>
        <path class="chart-line" d="${path}"></path>
        ${coords.map(([x, y, point]) => `
          <circle cx="${x}" cy="${y}" r="4" fill="#151713"></circle>
          <text class="chart-label" x="${x}" y="${height - 8}" text-anchor="middle">${escapeHtml(point.label)}</text>
          <text class="chart-label" x="${x}" y="${y - 10}" text-anchor="middle">${asMoney ? shortMoney(point.value) : point.value}</text>
        `).join("")}
      </svg>
    `;
  }

  function renderPairedBars(items, firstKey, secondKey) {
    const max = Math.max(...items.flatMap((item) => [item[firstKey], item[secondKey]]));
    return items.map((item) => `
      <div class="bar-group">
        <div class="bar-pair">
          <span class="bar" title="Altas" style="height:${(item[firstKey] / max) * 100}%"></span>
          <span class="bar secondary" title="Bajas" style="height:${(item[secondKey] / max) * 100}%"></span>
        </div>
        <span class="bar-label">${escapeHtml(item.month)}</span>
      </div>
    `).join("");
  }

  function horizontalBars(items, valueKey, suffix = "", maxOverride) {
    const max = maxOverride || Math.max(...items.map((item) => item[valueKey]));
    return `
      <div class="horizontal-bars">
        ${items.map((item) => {
          const value = item[valueKey];
          const label = item.label || item.name || item.task;
          const formatted = suffix === "€" ? money(value) : `${value}${suffix}`;
          return `
            <div class="hbar-row">
              <span>${escapeHtml(label)}</span>
              <div class="hbar"><i style="width:${Math.max(4, (value / max) * 100)}%"></i></div>
              <strong>${escapeHtml(formatted)}</strong>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function progress(value) {
    return `
      <div class="progress-track" title="${value}%">
        <div class="progress-fill" style="width:${Math.max(0, Math.min(100, value))}%"></div>
      </div>
      <small>${value}%</small>
    `;
  }

  function tags(values) {
    return values.map((value) => `<span class="tag">${escapeHtml(value)}</span>`).join("");
  }

  function status(value) {
    const normalized = String(value).toLowerCase();
    const type = normalized.includes("impago") || normalized.includes("urgente") || normalized.includes("comprar") || normalized.includes("baja") ? "danger" :
      normalized.includes("pendiente") || normalized.includes("revisar") || normalized.includes("ofrecido") || normalized.includes("mock manual") ? "warn" :
      normalized.includes("pagada") || normalized.includes("correcto") || normalized.includes("conectado") || normalized.includes("enviado") ? "positive" : "";
    return `<span class="status-pill ${type}">${escapeHtml(value)}</span>`;
  }

  function risk(value) {
    const type = value === "Alto" ? "risk" : value === "Medio" ? "waiting" : "active";
    return `<span class="tag ${type}">${escapeHtml(value)}</span>`;
  }

  function formatMetric(value, suffix) {
    if (suffix === "€") return money(value);
    return `${Number(value).toLocaleString("es-ES")}${suffix || ""}`;
  }

  function money(value) {
    return `${Number(value).toLocaleString("es-ES")}€`;
  }

  function shortMoney(value) {
    return `${Math.round(value / 1000)}k€`;
  }

  function dateShort(value) {
    return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
  }

  function sum(values) {
    return values.reduce((total, value) => total + Number(value || 0), 0);
  }

  function average(values) {
    return sum(values) / values.length;
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
