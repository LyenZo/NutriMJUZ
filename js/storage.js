// storage.js

// --- PACIENTES ---
export function guardarPaciente(paciente) {
  const lista = obtenerPacientes();
  paciente.id = Date.now(); // ID único
  paciente.peso = parseFloat(paciente.peso);
  paciente.altura = parseFloat(paciente.altura);
  lista.push(paciente);
  localStorage.setItem("pacientes", JSON.stringify(lista));
  return paciente.id;
}

export function obtenerPacientes() {
  return JSON.parse(localStorage.getItem("pacientes") || "[]");
}

// --- CONSULTAS ---
export function guardarConsulta(consulta) {
  // consulta solo guarda: pacienteId, fecha, hora, evolucion, plan
  // NO guarda peso ni altura — eso evita duplicación (criterio 3)
  const lista = obtenerConsultas();
  consulta.id = Date.now();
  lista.push(consulta);
  localStorage.setItem("consultas", JSON.stringify(lista));
}

export function obtenerConsultasPorPaciente(pacienteId) {
  return obtenerConsultas()
    .filter(c => c.pacienteId === pacienteId)
    .sort((a, b) => b.id - a.id); // más reciente primero
}

export function actualizarConsulta(idConsulta, datosNuevos) {
  const lista = obtenerConsultas().map(c =>
    c.id === idConsulta ? { ...c, ...datosNuevos } : c
  );
  localStorage.setItem("consultas", JSON.stringify(lista));
}

function obtenerConsultas() {
  return JSON.parse(localStorage.getItem("consultas") || "[]");
}