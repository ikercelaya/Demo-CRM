/* =============================================================
   MOMA CRM — Lógica de la aplicación (SPA de demo)
   ============================================================= */
(function () {
  'use strict';

  MOMA_AUTH.guard();
  const D = window.MOMA_DATA;

  /* -------- Usuario en sesión -------- */
  const u = MOMA_AUTH.user();
  if (u) {
    document.getElementById('userName').textContent = u.nombre;
    document.getElementById('userRole').textContent = u.rol;
    document.getElementById('userAvatar').textContent = u.nombre.charAt(0);
  }

  /* -------- Utilidades -------- */
  const euros = n => Math.round(n).toLocaleString('es-ES') + ' €';
  const num = n => Number(n).toLocaleString('es-ES');
  const initials = s => s.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const PALETTE = ['#84cc16', '#0d9488', '#2563eb', '#f59e0b', '#e11d48', '#7c3aed', '#0ea5e9', '#65a30d'];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* -------- Chart.js defaults -------- */
  if (window.Chart) {
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#64748b';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.boxWidth = 8;
    Chart.defaults.plugins.legend.labels.padding = 14;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.backgroundColor = '#0f172a';
    Chart.defaults.maintainAspectRatio = false;
  }
  const gridClr = 'rgba(100,116,139,.12)';
  const noGrid = { grid: { display: false }, border: { display: false } };
  const yGrid = { grid: { color: gridClr }, border: { display: false }, ticks: { padding: 8 } };

  /* -------- KPI helper -------- */
  function kpi(o) {
    const trend = o.trend
      ? `<span class="trend ${o.trend.dir}">${o.trend.txt}</span>` : '';
    return `<div class="kpi">
      <div class="k-label">
        <span class="k-ico" style="background:${o.iconBg}">${o.icon}</span>${o.label}
      </div>
      <div class="k-value">${o.value}</div>
      <div class="k-sub">${o.sub || ''} ${trend}</div>
    </div>`;
  }

  /* -------- Navegación -------- */
  const NAV = [
    { g: 'Panel' },
    { id: 'dashboard', icon: '📊', label: 'Cuadro de Mando', title: 'Cuadro de Mando', crumb: 'Visión general del centro · Junio 2026' },
    { g: 'Clientes' },
    { id: 'clientes', icon: '👥', label: 'Clientes', title: 'Clientes', crumb: 'Base de datos de usuarios' },
    { id: 'espera', icon: '⏳', label: 'Lista de espera', title: 'Lista de espera', crumb: 'Personas esperando plaza' },
    { g: 'Operativa' },
    { id: 'ocupacion', icon: '🗓️', label: 'Ocupación', title: 'Ocupación del centro', crumb: '¿Estamos aprovechando la capacidad?' },
    { id: 'equipo', icon: '🏋️', label: 'Equipo', title: 'Rendimiento del equipo', crumb: '¿Quién hace crecer MOMA?' },
    { id: 'servicios', icon: '🧘', label: 'Servicios Mind/Body', title: 'Desarrollo de servicios', crumb: 'Mind · BodyMind · Nutrición' },
    { g: 'Negocio' },
    { id: 'facturacion', icon: '💶', label: 'Facturación', title: 'Facturación y rentabilidad', crumb: '¿Cuánto dinero genera MOMA?' },
    { id: 'marketing', icon: '📣', label: 'Marketing', title: 'Marketing y captación', crumb: 'Leads · conversión · origen' },
    { g: 'Atención' },
    { id: 'conversaciones', icon: '💬', label: 'Conversaciones', title: 'Conversaciones', crumb: 'Chats con clientes y leads', badge: () => window.MOMA_getConversaciones().length },
    { id: 'incidencias', icon: '🛠️', label: 'Incidencias', title: 'Registro de incidencias', crumb: 'Problemas del centro' },
    { id: 'alertas', icon: '🚨', label: 'Alertas', title: 'Alertas del centro', crumb: 'Detecta problemas rápido', badge: () => D.impagos.length + D.ocupacion.bajaOcupacion.length },
    { g: 'Ayuda' },
    { id: 'manual', icon: '📘', label: 'Manual', title: 'Manual de uso', crumb: 'Guía rápida para entender la demo' }
  ];

  function buildNav() {
    const nav = document.getElementById('nav');
    nav.innerHTML = NAV.map(n => {
      if (n.g) return `<div class="group-label">${n.g}</div>`;
      const badge = n.badge ? `<span class="badge">${n.badge()}</span>` : '';
      return `<a href="#${n.id}" data-id="${n.id}"><span class="ico">${n.icon}</span>${n.label}${badge}</a>`;
    }).join('');
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', e => { e.preventDefault(); go(a.dataset.id); });
    });
  }

  const rendered = new Set();
  function go(id) {
    const meta = NAV.find(n => n.id === id);
    if (!meta) return;
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.dataset.id === id));
    const sec = document.getElementById('sec-' + id);
    sec.classList.add('active');
    document.getElementById('pageTitle').textContent = meta.title;
    document.getElementById('pageCrumb').textContent = meta.crumb;
    document.getElementById('sidebar').classList.remove('open');
    if (!rendered.has(id)) {
      SECTIONS[id](sec);
      rendered.add(id);
    }
    window.scrollTo(0, 0);
  }

  /* =====================================================
     SECCIONES
     ===================================================== */
  const SECTIONS = {};

  /* ---------- CUADRO DE MANDO ---------- */
  SECTIONS.dashboard = function (el) {
    const c = D.crecimiento, f = D.facturacion, o = D.ocupacion;
    el.innerHTML = `
      <div class="kpi-grid">
        ${kpi({ label: 'Usuarios activos', value: num(c.activos), icon: '👥', iconBg: 'var(--accent-soft)', sub: 'Crecimiento neto', trend: { dir: c.neto >= 0 ? 'up' : 'down', txt: (c.neto >= 0 ? '+' : '') + c.neto } })}
        ${kpi({ label: 'Altas del mes', value: num(c.altasMes), icon: '📈', iconBg: 'var(--green-soft)', sub: 'Nuevas incorporaciones' })}
        ${kpi({ label: 'Bajas del mes', value: num(c.bajasMes), icon: '📉', iconBg: 'var(--red-soft)', sub: 'Este mes' })}
        ${kpi({ label: 'Permanencia media', value: c.permanenciaMedia + ' m', icon: '⏱️', iconBg: 'var(--blue-soft)', sub: 'Meses por cliente' })}
      </div>
      <div class="kpi-grid">
        ${kpi({ label: 'Ocupación media', value: o.media + ' %', icon: '🗓️', iconBg: 'var(--amber-soft)', sub: o.reservasTotales + ' / ' + o.plazasTotales + ' plazas' })}
        ${kpi({ label: 'Facturación mensual', value: euros(f.total), icon: '💶', iconBg: 'var(--green-soft)', sub: 'Total del mes', trend: { dir: 'up', txt: '+8,2%' } })}
        ${kpi({ label: 'Beneficio mensual', value: euros(f.beneficio), icon: '💰', iconBg: 'var(--accent-soft)', sub: 'Margen ' + f.margen + '%' })}
        ${kpi({ label: 'Lista de espera', value: num(c.listaEspera), icon: '⏳', iconBg: 'var(--blue-soft)', sub: 'Esperando plaza' })}
      </div>

      <div class="section-title"><span class="dot"></span> Clientes y crecimiento</div>
      <div class="grid g-2-1">
        <div class="card">
          <div class="head"><h3>Evolución de usuarios activos</h3></div>
          <div class="desc">¿MOMA está creciendo o perdiendo clientes?</div>
          <div class="chart-box"><canvas id="ch-activos"></canvas></div>
        </div>
        <div class="card">
          <div class="head"><h3>Altas vs bajas</h3></div>
          <div class="desc">Últimos 12 meses</div>
          <div class="chart-box"><canvas id="ch-altasbajas"></canvas></div>
        </div>
      </div>

      <div class="section-title"><span class="dot"></span> Ocupación del centro</div>
      <div class="grid g-2-1">
        <div class="card">
          <div class="head"><h3>Ocupación por horario</h3></div>
          <div class="desc">Distribución de la demanda por franja horaria</div>
          <div class="chart-box"><canvas id="ch-ochorario"></canvas></div>
        </div>
        <div class="card">
          <div class="head"><h3>Ocupación por franja</h3></div>
          <div class="desc">Mañana · Mediodía · Tarde</div>
          <div class="chart-box"><canvas id="ch-ocfranja"></canvas></div>
        </div>
      </div>

      <div class="section-title"><span class="dot"></span> Rendimiento y negocio</div>
      <div class="grid g-2">
        <div class="card">
          <div class="head"><h3>Ocupación media por entrenador</h3></div>
          <div class="desc">¿Quién llena clases y quién no?</div>
          <div class="chart-box"><canvas id="ch-entrenador"></canvas></div>
        </div>
        <div class="card">
          <div class="head"><h3>Facturación por servicio</h3></div>
          <div class="desc">Reparto de ingresos del mes</div>
          <div class="chart-box"><canvas id="ch-factservicio"></canvas></div>
        </div>
      </div>

      <div class="grid g-2">
        <div class="card">
          <div class="head"><h3>Facturación mensual</h3></div>
          <div class="desc">Evolución de ingresos</div>
          <div class="chart-box"><canvas id="ch-factmes"></canvas></div>
        </div>
        <div class="card">
          <div class="head"><h3>Resultados TEST MOMA</h3></div>
          <div class="desc">Mejora media de los usuarios (%)</div>
          <div class="chart-box"><canvas id="ch-testmoma"></canvas></div>
        </div>
      </div>`;

    // charts
    const S = D.serieMensual;
    new Chart(gid('ch-activos'), {
      type: 'line',
      data: { labels: D.meses, datasets: [{ label: 'Usuarios activos', data: S.map(m => m.activos), borderColor: PALETTE[0], backgroundColor: fill('ch-activos', PALETTE[0]), fill: true, tension: .35, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5 }] },
      options: baseOpts({ legend: false })
    });
    new Chart(gid('ch-altasbajas'), {
      type: 'bar',
      data: { labels: D.meses, datasets: [
        { label: 'Altas', data: S.map(m => m.altas), backgroundColor: '#84cc16', borderRadius: 4 },
        { label: 'Bajas', data: S.map(m => m.bajas), backgroundColor: '#e11d48', borderRadius: 4 }
      ] },
      options: baseOpts()
    });
    new Chart(gid('ch-ochorario'), {
      type: 'bar',
      data: { labels: o.porHorario.map(h => h.hora), datasets: [{ label: 'Ocupación %', data: o.porHorario.map(h => h.ocupacion), backgroundColor: o.porHorario.map(h => h.ocupacion >= 85 ? '#65a30d' : h.ocupacion >= 60 ? '#f59e0b' : '#e11d48'), borderRadius: 4 }] },
      options: baseOpts({ legend: false, max: 100 })
    });
    new Chart(gid('ch-ocfranja'), {
      type: 'doughnut',
      data: { labels: o.porFranja.map(x => x.franja), datasets: [{ data: o.porFranja.map(x => x.ocupacion), backgroundColor: [PALETTE[0], PALETTE[3], PALETTE[1]], borderWidth: 2, borderColor: '#fff' }] },
      options: donutOpts()
    });
    new Chart(gid('ch-entrenador'), {
      type: 'bar',
      data: { labels: D.entrenadores.map(e => e.nombre.split(' ')[0]), datasets: [{ label: 'Ocupación %', data: D.entrenadores.map(e => e.ocupacion), backgroundColor: D.entrenadores.map(e => e.color), borderRadius: 4 }] },
      options: baseOpts({ legend: false, indexAxis: 'y', max: 100 })
    });
    new Chart(gid('ch-factservicio'), {
      type: 'doughnut',
      data: { labels: f.porServicio.map(s => s.servicio), datasets: [{ data: f.porServicio.map(s => s.importe), backgroundColor: PALETTE, borderWidth: 2, borderColor: '#fff' }] },
      options: donutOpts(euros)
    });
    new Chart(gid('ch-factmes'), {
      type: 'line',
      data: { labels: D.meses, datasets: [{ label: 'Facturación', data: S.map(m => m.facturacion), borderColor: PALETTE[2], backgroundColor: fill('ch-factmes', PALETTE[2]), fill: true, tension: .35, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5 }] },
      options: baseOpts({ legend: false, yFmt: v => (v / 1000) + 'k' })
    });
    new Chart(gid('ch-testmoma'), {
      type: 'radar',
      data: { labels: D.testMoma.map(t => t.variable), datasets: [{ label: 'Mejora media %', data: D.testMoma.map(t => t.mejora), backgroundColor: 'rgba(132,204,22,.20)', borderColor: PALETTE[0], borderWidth: 2, pointBackgroundColor: PALETTE[0] }] },
      options: radarOpts()
    });
  };

  /* ---------- CLIENTES ---------- */
  SECTIONS.clientes = function (el) {
    el.innerHTML = `
      <div class="toolbar">
        <input id="cliSearch" placeholder="🔍 Buscar por nombre, email o teléfono…" />
        <select id="cliEstado"><option value="">Todos los estados</option><option>Activo</option><option>Baja</option></select>
        <select id="cliEnt"><option value="">Todos los entrenadores</option>${D.entrenadores.map(e => `<option>${e.nombre}</option>`).join('')}</select>
        <select id="cliPago"><option value="">Pago: todos</option><option>Al día</option><option>Impago</option></select>
        <div class="spacer"></div>
        <span class="count-pill" id="cliCount"></span>
      </div>
      <div class="card" style="padding:0">
        <div class="table-wrap">
          <table>
            <thead><tr>
              <th>Cliente</th><th>Entrenador</th><th>Plan</th><th>Servicios</th>
              <th>Cuota</th><th>Horario</th><th>Alta</th><th>Estado</th><th>Pago</th>
            </tr></thead>
            <tbody id="cliBody"></tbody>
          </table>
        </div>
      </div>`;

    const body = document.getElementById('cliBody');
    const search = document.getElementById('cliSearch');
    const fEstado = document.getElementById('cliEstado');
    const fEnt = document.getElementById('cliEnt');
    const fPago = document.getElementById('cliPago');

    function render() {
      const q = search.value.toLowerCase();
      const rows = D.clientes.filter(c =>
        (!q || (c.nombre + c.email + c.telefono).toLowerCase().includes(q)) &&
        (!fEstado.value || c.estado === fEstado.value) &&
        (!fEnt.value || c.entrenador === fEnt.value) &&
        (!fPago.value || c.pago === fPago.value)
      );
      document.getElementById('cliCount').textContent = rows.length + ' clientes';
      body.innerHTML = rows.slice(0, 200).map(c => `
        <tr>
          <td><span class="avatar-sm">${initials(c.nombre)}</span><b>${esc(c.nombre)}</b><br><span style="color:var(--text-soft);font-size:12px;margin-left:36px">${esc(c.email)}</span></td>
          <td>${esc(c.entrenador)}</td>
          <td>${esc(c.plan)}</td>
          <td>${c.servicios.map(s => `<span class="tag violet">${s}</span>`).join(' ')}</td>
          <td><b>${euros(c.cuota)}</b></td>
          <td>${c.horario}</td>
          <td>${c.alta}</td>
          <td><span class="tag ${c.estado === 'Activo' ? 'green' : 'gray'}">${c.estado}</span></td>
          <td><span class="tag ${c.pago === 'Al día' ? 'green' : 'red'}">${c.pago}</span></td>
        </tr>`).join('');
    }
    [search, fEstado, fEnt, fPago].forEach(x => x.addEventListener('input', render));
    render();
  };

  /* ---------- LISTA DE ESPERA ---------- */
  SECTIONS.espera = function (el) {
    el.innerHTML = `
      <p class="lead-in">Personas interesadas que esperan una plaza disponible. Cuando se libera un horario se ofrece por orden de llegada (estado “Horario ofrecido”).</p>
      <div class="card" style="padding:0">
        <div class="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Nombre</th><th>Teléfono</th><th>Servicio</th><th>Horario deseado</th><th>Origen</th><th>Fecha solicitud</th><th>Estado</th></tr></thead>
            <tbody>
              ${D.listaEspera.map((p, i) => `<tr>
                <td>${i + 1}</td>
                <td><span class="avatar-sm">${initials(p.nombre)}</span><b>${esc(p.nombre)}</b></td>
                <td>${p.telefono}</td>
                <td><span class="tag violet">${p.servicio}</span></td>
                <td>${p.horarioDeseado}</td>
                <td>${p.origen}</td>
                <td>${p.fecha}</td>
                <td><span class="tag ${p.estado === 'Horario ofrecido' ? 'amber' : 'blue'}">${p.estado}</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  };

  /* ---------- OCUPACIÓN ---------- */
  SECTIONS.ocupacion = function (el) {
    const o = D.ocupacion;
    el.innerHTML = `
      <div class="kpi-grid">
        ${kpi({ label: 'Ocupación media', value: o.media + ' %', icon: '🎯', iconBg: 'var(--accent-soft)', sub: 'Reservas / plazas' })}
        ${kpi({ label: 'Plazas disponibles', value: num(o.plazasTotales), icon: '🪑', iconBg: 'var(--blue-soft)', sub: 'Capacidad total' })}
        ${kpi({ label: 'Reservas totales', value: num(o.reservasTotales), icon: '📋', iconBg: 'var(--green-soft)', sub: 'Este mes' })}
        ${kpi({ label: 'Clases llenas', value: o.clasesLlenas + ' / ' + o.clasesTotales, icon: '🔥', iconBg: 'var(--amber-soft)', sub: 'Al 100% de ocupación' })}
      </div>
      <div class="grid g-2">
        <div class="card"><div class="head"><h3>Ocupación por horario</h3></div><div class="desc">Franjas con mayor y menor demanda</div><div class="chart-box"><canvas id="oc-h"></canvas></div></div>
        <div class="card"><div class="head"><h3>Ocupación por día</h3></div><div class="desc">Lunes a viernes</div><div class="chart-box"><canvas id="oc-d"></canvas></div></div>
      </div>
      <div class="grid g-2-1">
        <div class="card"><div class="head"><h3>Ocupación por entrenador</h3></div><div class="desc">Aprovechamiento de plazas por entrenador</div><div class="chart-box"><canvas id="oc-e"></canvas></div></div>
        <div class="card">
          <div class="head"><h3>Clases con baja ocupación</h3></div>
          <div class="desc">Por debajo del 60% — revisar</div>
          <div style="margin-top:6px">
            ${o.bajaOcupacion.map(c => `<div class="alert-item">
              <div class="a-body"><b>${esc(c.clase)}</b><p>Ocupación actual</p></div>
              <span class="a-count" style="color:var(--red)">${c.ocupacion}%</span>
            </div>`).join('')}
          </div>
        </div>
      </div>`;
    new Chart(gid('oc-h'), { type: 'bar', data: { labels: o.porHorario.map(h => h.hora), datasets: [{ label: 'Ocupación %', data: o.porHorario.map(h => h.ocupacion), backgroundColor: o.porHorario.map(h => h.ocupacion >= 85 ? '#65a30d' : h.ocupacion >= 60 ? '#f59e0b' : '#e11d48'), borderRadius: 4 }] }, options: baseOpts({ legend: false, max: 100 }) });
    new Chart(gid('oc-d'), { type: 'bar', data: { labels: o.porDia.map(d => d.dia), datasets: [{ label: 'Ocupación %', data: o.porDia.map(d => d.ocupacion), backgroundColor: PALETTE[1], borderRadius: 4 }] }, options: baseOpts({ legend: false, max: 100 }) });
    new Chart(gid('oc-e'), { type: 'bar', data: { labels: D.entrenadores.map(e => e.nombre.split(' ')[0]), datasets: [{ label: 'Ocupación %', data: D.entrenadores.map(e => e.ocupacion), backgroundColor: D.entrenadores.map(e => e.color), borderRadius: 4 }] }, options: baseOpts({ legend: false, indexAxis: 'y', max: 100 }) });
  };

  /* ---------- EQUIPO ---------- */
  SECTIONS.equipo = function (el) {
    el.innerHTML = `
      <p class="lead-in">Rendimiento por entrenador: ocupación de sus clases, usuarios asignados, bajas de sus usuarios y valoración media. <b>¿Quién hace crecer MOMA y quién no?</b></p>
      <div class="card" style="padding:0;margin-bottom:22px">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Entrenador</th><th>Ocupación</th><th>Usuarios</th><th>Clases/mes</th><th>Bajas</th><th>Protocolos</th><th>Valoración</th></tr></thead>
            <tbody>
              ${D.entrenadores.map(e => `<tr>
                <td><span class="avatar-sm" style="background:${e.color}22;color:${e.color}">${initials(e.nombre)}</span><b>${esc(e.nombre)}</b></td>
                <td><span class="mini-bar"><span class="track"><span class="fill" style="width:${e.ocupacion}%;background:${e.color}"></span></span> ${e.ocupacion}%</span></td>
                <td>${e.usuarios}</td>
                <td>${e.clases}</td>
                <td><span class="tag ${e.bajas <= 3 ? 'green' : e.bajas <= 6 ? 'amber' : 'red'}">${e.bajas}</span></td>
                <td>${e.protocolos}%</td>
                <td>⭐ ${e.valoracion}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="grid g-2">
        <div class="card"><div class="head"><h3>Ocupación media por entrenador</h3></div><div class="desc">Muy visual: quién llena clases</div><div class="chart-box"><canvas id="eq-oc"></canvas></div></div>
        <div class="card"><div class="head"><h3>Bajas por entrenador</h3></div><div class="desc">Usuarios que se han ido</div><div class="chart-box"><canvas id="eq-bajas"></canvas></div></div>
      </div>
      <div class="grid g-2">
        <div class="card"><div class="head"><h3>Valoración de usuarios</h3></div><div class="desc">Media sobre 5</div><div class="chart-box"><canvas id="eq-val"></canvas></div></div>
        <div class="card"><div class="head"><h3>Cumplimiento de protocolos</h3></div><div class="desc">Calidad de servicio (%)</div><div class="chart-box"><canvas id="eq-prot"></canvas></div></div>
      </div>`;
    const nombres = D.entrenadores.map(e => e.nombre.split(' ')[0]);
    const colores = D.entrenadores.map(e => e.color);
    new Chart(gid('eq-oc'), { type: 'bar', data: { labels: nombres, datasets: [{ label: 'Ocupación %', data: D.entrenadores.map(e => e.ocupacion), backgroundColor: colores, borderRadius: 4 }] }, options: baseOpts({ legend: false, indexAxis: 'y', max: 100 }) });
    new Chart(gid('eq-bajas'), { type: 'bar', data: { labels: nombres, datasets: [{ label: 'Bajas', data: D.entrenadores.map(e => e.bajas), backgroundColor: PALETTE[4], borderRadius: 4 }] }, options: baseOpts({ legend: false }) });
    new Chart(gid('eq-val'), { type: 'bar', data: { labels: nombres, datasets: [{ label: 'Valoración', data: D.entrenadores.map(e => e.valoracion), backgroundColor: PALETTE[0], borderRadius: 4 }] }, options: baseOpts({ legend: false, max: 5 }) });
    new Chart(gid('eq-prot'), { type: 'radar', data: { labels: nombres, datasets: [{ label: 'Protocolos %', data: D.entrenadores.map(e => e.protocolos), backgroundColor: 'rgba(37,99,235,.15)', borderColor: PALETTE[1], borderWidth: 2, pointBackgroundColor: PALETTE[1] }] }, options: radarOpts(100) });
  };

  /* ---------- FACTURACIÓN ---------- */
  SECTIONS.facturacion = function (el) {
    const f = D.facturacion, S = D.serieMensual;
    el.innerHTML = `
      <div class="kpi-grid">
        ${kpi({ label: 'Facturación total', value: euros(f.total), icon: '💶', iconBg: 'var(--green-soft)', sub: 'Mes actual' })}
        ${kpi({ label: 'Gastos totales', value: euros(f.gastosTotal), icon: '🧾', iconBg: 'var(--red-soft)', sub: 'Personal ' + euros(f.costePersonal) })}
        ${kpi({ label: 'Beneficio mensual', value: euros(f.beneficio), icon: '💰', iconBg: 'var(--accent-soft)', sub: 'Ingresos - gastos' })}
        ${kpi({ label: 'Margen de beneficio', value: f.margen + ' %', icon: '📊', iconBg: 'var(--blue-soft)', sub: 'Sobre facturación' })}
      </div>
      <div class="kpi-grid">
        ${kpi({ label: 'Ingreso medio / cliente', value: euros(D.valorPorCliente.ingresoMedio), icon: '🙋', iconBg: 'var(--amber-soft)', sub: 'Facturación / usuarios' })}
        ${kpi({ label: 'Servicios por cliente', value: D.valorPorCliente.serviciosPorCliente, icon: '🧩', iconBg: 'var(--accent-soft)', sub: 'Media contratada' })}
        ${kpi({ label: 'Coste de personal', value: euros(f.costePersonal), icon: '👷', iconBg: 'var(--red-soft)', sub: (Math.round(f.costePersonal / f.total * 100)) + '% de la facturación' })}
        ${kpi({ label: 'Facturación entrenamiento', value: euros(f.porServicio[0].importe), icon: '🏋️', iconBg: 'var(--green-soft)', sub: 'Servicio principal' })}
      </div>
      <div class="grid g-2-1">
        <div class="card"><div class="head"><h3>Facturación mensual</h3></div><div class="desc">Evolución de ingresos (12 meses)</div><div class="chart-box"><canvas id="fa-mes"></canvas></div></div>
        <div class="card"><div class="head"><h3>Facturación por servicio</h3></div><div class="desc">Reparto del mes</div><div class="chart-box"><canvas id="fa-serv"></canvas></div></div>
      </div>
      <div class="grid g-2">
        <div class="card"><div class="head"><h3>Gastos por categoría</h3></div><div class="desc">Estructura de costes</div><div class="chart-box"><canvas id="fa-gastos"></canvas></div></div>
        <div class="card"><div class="head"><h3>Ingreso medio por cliente</h3></div><div class="desc">Evolución mensual</div><div class="chart-box"><canvas id="fa-ingreso"></canvas></div></div>
      </div>`;
    new Chart(gid('fa-mes'), { type: 'line', data: { labels: D.meses, datasets: [{ label: 'Facturación', data: S.map(m => m.facturacion), borderColor: PALETTE[2], backgroundColor: fill('fa-mes', PALETTE[2]), fill: true, tension: .35, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5 }] }, options: baseOpts({ legend: false, yFmt: v => (v / 1000) + 'k' }) });
    new Chart(gid('fa-serv'), { type: 'doughnut', data: { labels: f.porServicio.map(s => s.servicio), datasets: [{ data: f.porServicio.map(s => s.importe), backgroundColor: PALETTE, borderWidth: 2, borderColor: '#fff' }] }, options: donutOpts(euros) });
    new Chart(gid('fa-gastos'), { type: 'bar', data: { labels: f.gastos.map(g => g.categoria), datasets: [{ label: 'Gasto', data: f.gastos.map(g => g.importe), backgroundColor: PALETTE[4], borderRadius: 4 }] }, options: baseOpts({ legend: false, yFmt: v => (v / 1000) + 'k' }) });
    new Chart(gid('fa-ingreso'), { type: 'line', data: { labels: D.meses, datasets: [{ label: '€ / cliente', data: S.map(m => m.ingresoMedio), borderColor: PALETTE[3], backgroundColor: fill('fa-ingreso', PALETTE[3]), fill: true, tension: .35, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5 }] }, options: baseOpts({ legend: false }) });
  };

  /* ---------- SERVICIOS (MIND / BODY) ---------- */
  SECTIONS.servicios = function (el) {
    const sm = D.servicios_mind;
    el.innerHTML = `
      <p class="lead-in"><b>¿Está creciendo el ecosistema MOMA o solo el entrenamiento?</b> Clientes por servicio, conversión desde entrenamiento y ocupación de las sesiones Mind.</p>
      <div class="kpi-grid">
        ${kpi({ label: 'Conversión a servicios', value: sm.conversion + ' %', icon: '🔁', iconBg: 'var(--accent-soft)', sub: 'Entreno → otros servicios' })}
        ${kpi({ label: 'Clientes Mindfulness', value: num(sm.clientesPorServicio[3].clientes), icon: '🧘', iconBg: 'var(--blue-soft)', sub: 'Activos en Mind' })}
        ${kpi({ label: 'Clientes Nutrición', value: num(sm.clientesPorServicio[1].clientes), icon: '🥗', iconBg: 'var(--green-soft)', sub: 'Activos' })}
        ${kpi({ label: 'Clientes BodyMind', value: num(sm.clientesPorServicio[2].clientes), icon: '🌀', iconBg: 'var(--amber-soft)', sub: 'Activos' })}
      </div>
      <div class="grid g-2">
        <div class="card"><div class="head"><h3>Clientes por servicio</h3></div><div class="desc">Reparto del ecosistema MOMA</div><div class="chart-box"><canvas id="sv-clientes"></canvas></div></div>
        <div class="card"><div class="head"><h3>Ocupación sesiones Mind</h3></div><div class="desc">Mindfulness · Grupo desarrollo · BowSpring</div><div class="chart-box"><canvas id="sv-sesiones"></canvas></div></div>
      </div>
      <div class="grid g-2-1">
        <div class="card"><div class="head"><h3>Evolución del área Mind</h3></div><div class="desc">Clientes Mind por mes</div><div class="chart-box"><canvas id="sv-evo"></canvas></div></div>
        <div class="card"><div class="head"><h3>Resultados TEST MOMA</h3></div><div class="desc">Mejora media (%)</div><div class="chart-box"><canvas id="sv-test"></canvas></div></div>
      </div>`;
    new Chart(gid('sv-clientes'), { type: 'bar', data: { labels: sm.clientesPorServicio.map(s => s.servicio), datasets: [{ label: 'Clientes', data: sm.clientesPorServicio.map(s => s.clientes), backgroundColor: PALETTE, borderRadius: 4 }] }, options: baseOpts({ legend: false }) });
    new Chart(gid('sv-sesiones'), { type: 'bar', data: { labels: sm.sesionesMind.map(s => s.sesion), datasets: [{ label: 'Ocupación %', data: sm.sesionesMind.map(s => s.ocupacion), backgroundColor: PALETTE[0], borderRadius: 4 }] }, options: baseOpts({ legend: false, indexAxis: 'y', max: 100 }) });
    new Chart(gid('sv-evo'), { type: 'line', data: { labels: D.meses, datasets: [{ label: 'Clientes Mind', data: D.serieMensual.map(m => m.clientesMind), borderColor: PALETTE[0], backgroundColor: fill('sv-evo', PALETTE[0]), fill: true, tension: .35, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5 }] }, options: baseOpts({ legend: false }) });
    new Chart(gid('sv-test'), { type: 'radar', data: { labels: D.testMoma.map(t => t.variable), datasets: [{ label: 'Mejora %', data: D.testMoma.map(t => t.mejora), backgroundColor: 'rgba(132,204,22,.20)', borderColor: PALETTE[0], borderWidth: 2, pointBackgroundColor: PALETTE[0] }] }, options: radarOpts() });
  };

  /* ---------- MARKETING ---------- */
  SECTIONS.marketing = function (el) {
    const m = D.marketing;
    el.innerHTML = `
      <div class="kpi-grid">
        ${kpi({ label: 'Leads generados', value: num(m.leads), icon: '🧲', iconBg: 'var(--blue-soft)', sub: 'Este mes' })}
        ${kpi({ label: 'Clientes nuevos', value: num(m.clientesNuevos), icon: '✨', iconBg: 'var(--green-soft)', sub: 'Altas del mes' })}
        ${kpi({ label: 'Tasa de conversión', value: m.conversion + ' %', icon: '🎯', iconBg: 'var(--accent-soft)', sub: 'Lead → cliente' })}
        ${kpi({ label: 'Origen principal', value: 'Instagram', icon: '📸', iconBg: 'var(--amber-soft)', sub: '38% de los clientes' })}
      </div>
      <div class="grid g-2">
        <div class="card"><div class="head"><h3>Origen de clientes</h3></div><div class="desc">¿De dónde vienen?</div><div class="chart-box"><canvas id="mk-origen"></canvas></div></div>
        <div class="card"><div class="head"><h3>Motivos de baja</h3></div><div class="desc">¿Por qué se van?</div><div class="chart-box"><canvas id="mk-baja"></canvas></div></div>
      </div>`;
    new Chart(gid('mk-origen'), { type: 'doughnut', data: { labels: m.origen.map(o => o.origen), datasets: [{ data: m.origen.map(o => o.valor), backgroundColor: PALETTE, borderWidth: 2, borderColor: '#fff' }] }, options: donutOpts(v => v + '%') });
    new Chart(gid('mk-baja'), { type: 'bar', data: { labels: D.motivosBaja.map(x => x.motivo), datasets: [{ label: 'Bajas', data: D.motivosBaja.map(x => x.valor), backgroundColor: PALETTE[4], borderRadius: 4 }] }, options: baseOpts({ legend: false }) });
  };

  /* ---------- CONVERSACIONES ---------- */
  SECTIONS.conversaciones = function (el) {
    const convs = window.MOMA_getConversaciones();
    el.innerHTML = `
      <p class="lead-in">Todos los chats con clientes y leads, incluidas las conversaciones del <b>chatbot web</b>. Las nuevas conversaciones del <a href="chat.html" target="_blank" style="color:var(--accent);font-weight:600">chatbot en vivo</a> aparecen aquí automáticamente.</p>
      <div class="conv-layout">
        <div class="conv-list" id="convList"></div>
        <div class="conv-detail" id="convDetail"></div>
      </div>`;
    const list = document.getElementById('convList');
    const detail = document.getElementById('convDetail');
    const tagClass = { 'Lead': 'blue', 'Cliente': 'violet' };
    const estadoClass = { 'Cita solicitada': 'amber', 'Resuelta': 'green', 'Baja solicitada': 'gray', 'Impago': 'red', 'Nueva': 'blue' };

    list.innerHTML = convs.map((c, i) => {
      const last = c.mensajes[c.mensajes.length - 1];
      return `<div class="conv-row ${i === 0 ? 'active' : ''}" data-i="${i}">
        <div class="cr-top"><span class="cr-name">${esc(c.nombre)}</span><span class="cr-date">${c.fecha}</span></div>
        <div class="cr-last">${esc(last.text)}</div>
        <div class="cr-tags">
          <span class="tag ${tagClass[c.etiqueta] || 'gray'}">${c.etiqueta}</span>
          <span class="tag ${estadoClass[c.estado] || 'gray'}">${c.estado}</span>
        </div>
      </div>`;
    }).join('');

    function showDetail(i) {
      const c = convs[i];
      detail.innerHTML = `
        <div class="cd-head">
          <div class="avatar">${initials(c.nombre)}</div>
          <div style="flex:1">
            <b>${esc(c.nombre)}</b><br><span>${c.telefono} · ${c.canal} · ${c.fecha}</span>
          </div>
          <span class="tag ${estadoClass[c.estado] || 'gray'}">${c.estado}</span>
        </div>
        <div class="conv-thread">
          ${c.mensajes.map(mm => `<div class="bubble ${mm.from}">${esc(mm.text)}<span class="t">${mm.hora || ''}</span></div>`).join('')}
        </div>`;
    }
    list.querySelectorAll('.conv-row').forEach(row => {
      row.addEventListener('click', () => {
        list.querySelectorAll('.conv-row').forEach(r => r.classList.remove('active'));
        row.classList.add('active');
        showDetail(+row.dataset.i);
      });
    });
    if (convs.length) showDetail(0); else detail.innerHTML = '<div class="empty">No hay conversaciones todavía.</div>';
  };

  /* ---------- INCIDENCIAS ---------- */
  SECTIONS.incidencias = function (el) {
    const abiertas = D.incidencias.filter(i => i.estado !== 'Resuelta').length;
    el.innerHTML = `
      <p class="lead-in">Registro centralizado de incidencias del centro para no perder de vista los problemas. <b>${abiertas} abiertas</b> de ${D.incidencias.length} totales.</p>
      <div class="card" style="padding:0">
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Fecha</th><th>Tipo</th><th>Descripción</th><th>Responsable</th><th>Prioridad</th><th>Estado</th></tr></thead>
            <tbody>
              ${D.incidencias.map(i => `<tr>
                <td><b>${i.id}</b></td>
                <td>${i.fecha}</td>
                <td><span class="tag gray">${i.tipo}</span></td>
                <td>${esc(i.descripcion)}</td>
                <td>${i.responsable}</td>
                <td><span class="tag ${i.prioridad === 'Alta' ? 'red' : i.prioridad === 'Media' ? 'amber' : 'gray'}">${i.prioridad}</span></td>
                <td><span class="tag ${i.estado === 'Resuelta' ? 'green' : i.estado === 'En curso' ? 'blue' : 'amber'}">${i.estado}</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  };

  /* ---------- ALERTAS ---------- */
  SECTIONS.alertas = function (el) {
    const impagos = D.impagos;
    const clasesBajas = D.ocupacion.bajaOcupacion;
    const entHighBaja = D.entrenadores.filter(e => e.bajas >= 6);
    const servBajos = D.facturacion.porServicio.filter(s => s.importe < 5000);
    function block(icon, bg, title, count, desc, body) {
      return `<div class="card" style="margin-bottom:16px">
        <div class="alert-item">
          <div class="alert-ico" style="background:${bg}">${icon}</div>
          <div class="a-body"><b>${title}</b><p>${desc}</p></div>
          <span class="a-count">${count}</span>
        </div>
        ${body || ''}
      </div>`;
    }
    el.innerHTML = `
      <p class="lead-in">Aquí detectas problemas rápido: impagos, clases con baja ocupación, entrenadores con muchas bajas y servicios con baja venta.</p>
      ${block('💸', 'var(--red-soft)', 'Usuarios con impagos', impagos.length, 'Avisar antes de dar de baja',
        `<div class="table-wrap"><table><thead><tr><th>Cliente</th><th>Entrenador</th><th>Cuota</th><th>Teléfono</th></tr></thead><tbody>
          ${impagos.slice(0, 8).map(c => `<tr><td><b>${esc(c.nombre)}</b></td><td>${esc(c.entrenador)}</td><td>${euros(c.cuota)}</td><td>${c.telefono}</td></tr>`).join('')}
        </tbody></table></div>`)}
      ${block('📉', 'var(--amber-soft)', 'Clases con baja ocupación', clasesBajas.length, 'Por debajo del 60%',
        `<div class="table-wrap"><table><thead><tr><th>Clase</th><th>Ocupación</th></tr></thead><tbody>
          ${clasesBajas.map(c => `<tr><td>${esc(c.clase)}</td><td><span class="tag red">${c.ocupacion}%</span></td></tr>`).join('')}
        </tbody></table></div>`)}
      ${block('🏋️', 'var(--blue-soft)', 'Entrenadores con bajas altas', entHighBaja.length, 'Revisar seguimiento de usuarios',
        `<div class="table-wrap"><table><thead><tr><th>Entrenador</th><th>Bajas</th><th>Ocupación</th><th>Valoración</th></tr></thead><tbody>
          ${entHighBaja.map(e => `<tr><td><b>${esc(e.nombre)}</b></td><td><span class="tag red">${e.bajas}</span></td><td>${e.ocupacion}%</td><td>⭐ ${e.valoracion}</td></tr>`).join('')}
        </tbody></table></div>`)}
      ${block('🛒', 'var(--accent-soft)', 'Servicios con baja venta', servBajos.length, 'Facturación por debajo de 5.000 €',
        `<div class="table-wrap"><table><thead><tr><th>Servicio</th><th>Facturación</th></tr></thead><tbody>
          ${servBajos.map(s => `<tr><td>${s.servicio}</td><td>${euros(s.importe)}</td></tr>`).join('')}
        </tbody></table></div>`)}`;
  };

  /* ---------- MANUAL ---------- */
  SECTIONS.manual = function (el) {
    el.innerHTML = `
      <p class="lead-in">Guía rápida para entender qué contiene esta demo, cómo se usa y qué datos son simulados. El manual completo también está guardado como archivo Markdown en el repositorio.</p>
      <div class="manual-hero card">
        <div>
          <span class="tag green">Demo sin base de datos</span>
          <h2>MOMA CRM centraliza dirección, clientes, ocupación, equipo, negocio y atención.</h2>
          <p>Todos los datos que ves son ficticios y sirven para enseñar el funcionamiento antes de conectar formularios, facturación, APP MOMA o Virtuagym.</p>
        </div>
        <a class="manual-link" href="MANUAL_CLIENTE.md" target="_blank" rel="noreferrer">Abrir manual .md</a>
      </div>

      <div class="grid g-3">
        <div class="card manual-card">
          <h3>Acceso</h3>
          <p>Usuario: <b>admin@momaep.es</b></p>
          <p>Contraseña: <b>moma2025</b></p>
          <p>También funciona <b>direccion@momaep.es</b> con la misma contraseña.</p>
        </div>
        <div class="card manual-card">
          <h3>Rutas principales</h3>
          <p><b>/</b> Login del CRM</p>
          <p><b>/app.html</b> Panel interno</p>
          <p><b>/chat.html</b> Chatbot público</p>
        </div>
        <div class="card manual-card">
          <h3>Qué se guarda</h3>
          <p>La demo no guarda datos reales. Las conversaciones nuevas del chatbot se guardan solo en el navegador para poder enseñarlas en Conversaciones.</p>
        </div>
      </div>

      <div class="card">
        <div class="head"><h3>Secciones del CRM</h3></div>
        <div class="manual-grid">
          <div><b>Cuadro de Mando</b><span>KPIs de dirección, crecimiento, ocupación, facturación y Test MOMA.</span></div>
          <div><b>Clientes</b><span>Listado con entrenador, plan, servicios, cuota, horario, estado y pago.</span></div>
          <div><b>Lista de espera</b><span>Personas interesadas, orden de llegada, servicio, horario y origen.</span></div>
          <div><b>Ocupación</b><span>Plazas, reservas, clases llenas, franjas fuertes y clases con baja ocupación.</span></div>
          <div><b>Equipo</b><span>Rendimiento por entrenador: ocupación, bajas, protocolos y valoración.</span></div>
          <div><b>Servicios Mind/Body</b><span>Nutrición, BodyMind, Mindfulness, talleres y conversión desde entrenamiento.</span></div>
          <div><b>Facturación</b><span>Ingresos, gastos, beneficio, margen y facturación por servicio.</span></div>
          <div><b>Marketing</b><span>Leads, nuevos clientes, conversión, origen de clientes y motivos de baja.</span></div>
          <div><b>Conversaciones</b><span>Inbox de chats con leads y clientes, incluyendo el chatbot público.</span></div>
          <div><b>Incidencias</b><span>Registro de problemas del centro con prioridad, responsable y estado.</span></div>
          <div><b>Alertas</b><span>Impagos, baja ocupación, entrenadores con muchas bajas y servicios con baja venta.</span></div>
        </div>
      </div>

      <div class="grid g-2">
        <div class="card manual-card">
          <h3>Cómo funciona el chatbot</h3>
          <p>El chatbot vive en <b>/chat.html</b>. Permite simular preguntas de clientes sobre altas, horarios, reservas, bajas, lista de espera, servicios Mind/Body e impagos.</p>
          <p>Las conversaciones nuevas aparecen automáticamente en el apartado <b>Conversaciones</b> de este CRM.</p>
        </div>
        <div class="card manual-card">
          <h3>Qué faltaría en la versión real</h3>
          <p>Conectar base de datos, formularios, facturación, usuarios reales, APP MOMA o Virtuagym y un chatbot con información real del centro.</p>
        </div>
      </div>`;
  };

  /* =====================================================
     Helpers de Chart.js
     ===================================================== */
  function gid(id) { return document.getElementById(id).getContext('2d'); }
  function fill(id, color) {
    const ctx = document.getElementById(id).getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 280);
    g.addColorStop(0, color + '33');
    g.addColorStop(1, color + '02');
    return g;
  }
  function baseOpts(o) {
    o = o || {};
    return {
      indexAxis: o.indexAxis || 'x',
      plugins: { legend: { display: o.legend !== false, position: 'bottom' } },
      scales: {
        x: o.indexAxis === 'y' ? { ...yGrid, max: o.max, ticks: { callback: v => o.yFmt ? o.yFmt(v) : v } } : noGrid,
        y: o.indexAxis === 'y' ? noGrid : { ...yGrid, max: o.max, ticks: { padding: 8, callback: v => o.yFmt ? o.yFmt(v) : v } }
      }
    };
  }
  function donutOpts(fmt) {
    return {
      cutout: '62%',
      plugins: {
        legend: { position: 'right' },
        tooltip: { callbacks: { label: c => ' ' + c.label + ': ' + (fmt ? fmt(c.parsed) : c.parsed) } }
      }
    };
  }
  function radarOpts(max) {
    return {
      plugins: { legend: { display: false } },
      scales: { r: { suggestedMin: 0, suggestedMax: max || 30, angleLines: { color: gridClr }, grid: { color: gridClr }, pointLabels: { font: { size: 12 } }, ticks: { display: false } } }
    };
  }

  /* -------- Arranque -------- */
  buildNav();
  const initial = (location.hash || '#dashboard').slice(1);
  go(NAV.find(n => n.id === initial) ? initial : 'dashboard');
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (NAV.find(n => n.id === id)) go(id);
  });

})();
