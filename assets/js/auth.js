/* =============================================================
   MOMA CRM — Autenticación de DEMO (solo cliente, sin backend)
   -------------------------------------------------------------
   ⚠️ Esto es una demostración. La "autenticación" es puramente
   simbólica y vive en el navegador (sessionStorage). No protege
   datos reales — no hay base de datos ni información sensible.
   ============================================================= */
(function (global) {
  'use strict';

  // Cuentas de demo. En una implementación real esto se validaría
  // en el servidor contra una base de datos con contraseñas cifradas.
  const CUENTAS = [
    { email: 'admin@momaep.es',     pass: 'moma2025', nombre: 'Administrador', rol: 'Dirección' },
    { email: 'direccion@momaep.es', pass: 'moma2025', nombre: 'Administrador', rol: 'Dirección' }
  ];

  const KEY = 'moma_session';

  const MOMA_AUTH = {
    login(email, pass) {
      const u = CUENTAS.find(c => c.email === email && c.pass === pass);
      if (!u) return false;
      sessionStorage.setItem(KEY, JSON.stringify({ email: u.email, nombre: u.nombre, rol: u.rol }));
      return true;
    },
    isLogged() {
      return !!sessionStorage.getItem(KEY);
    },
    user() {
      try { return JSON.parse(sessionStorage.getItem(KEY)); } catch (e) { return null; }
    },
    logout() {
      sessionStorage.removeItem(KEY);
      window.location.href = 'index.html';
    },
    // Protege una página: si no hay sesión, redirige al login.
    guard() {
      if (!this.isLogged()) window.location.href = 'index.html';
    }
  };

  global.MOMA_AUTH = MOMA_AUTH;
})(window);
