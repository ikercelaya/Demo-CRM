/* Prueba rápida del motor del chatbot (node scripts/test-chat.js) */
const chat = require('../api/chat.js');

function step(messages, name) {
  return chat.procesar({ messages, name });
}

const casos = [
  { name: '', msgs: [{ from: 'user', text: 'Marta Colomer' }], espera: 'name' },
  { name: '', msgs: [{ from: 'user', text: 'Hola, soy Laura Gómez' }], espera: 'name2' },
  { name: 'Marta', msgs: [{ from: 'user', text: '¿Qué precio tienen las clases?' }], espera: 'precio' },
  { name: 'Marta', msgs: [{ from: 'user', text: 'quiero apuntarme a entrenamiento' }], espera: 'alta' },
  { name: 'Marta', msgs: [{ from: 'user', text: 'me interesa el mindfulness' }], espera: 'mind' },
  { name: 'Marta', msgs: [{ from: 'user', text: 'quiero darme de baja' }], espera: 'baja' },
  { name: 'Marta', msgs: [{ from: 'user', text: 'mi teléfono es 622 145 908' }], espera: 'telefono' },
  { name: 'Marta', msgs: [{ from: 'user', text: '¿cuál es el horario?' }], espera: 'horario' },
  { name: 'Marta', msgs: [{ from: 'user', text: 'gracias!' }], espera: 'cierre' }
];

let ok = 0;
for (const c of casos) {
  const r = step(c.msgs, c.name);
  const linea = `[${c.espera.padEnd(9)}] name="${r.name}" estado="${r.estado}"  ->  ${r.reply.slice(0, 70)}...`;
  console.log(linea);
  if (r.reply && r.reply.length > 10) ok++;
}
console.log(`\n${ok}/${casos.length} respuestas generadas correctamente.`);
if (ok !== casos.length) process.exit(1);
