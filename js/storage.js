

const KEY_PACIENTES  = "nutri_pacientes";
const KEY_CONSULTAS  = "nutri_consultas";


/**

 * @returns {Array}
 */
export function obtenerPacientes() {
  return JSON.parse(localStorage.getItem(KEY_PACIENTES) || "[]");
}

/**

 * @param {Object} datos - { nombre, edad, sexo, peso, altura }
 * @returns {number} ID generado
 */
export function guardarPaciente(datos) {
  const lista = obtenerPacientes();
  const nuevo = {
    id:     Date.now(),
    nombre: datos.nombre.trim(),
    edad:   parseInt(datos.edad, 10),
    sexo:   datos.sexo,
    peso:   parseFloat(datos.peso),    
    altura: parseFloat(datos.altura),  
    imc:    parseFloat(datos.imc),
    diagnostico: datos.diagnostico,
  };
  lista.push(nuevo);
  localStorage.setItem(KEY_PACIENTES, JSON.stringify(lista));
  return nuevo.id;
}

/**
 * Busca un paciente por su ID.
 * @param {number} id
 * @returns {Object|undefined}
 */
export function obtenerPacientePorId(id) {
  return obtenerPacientes().find(p => p.id === id);
}


/**
 * @returns {Array}
 */
export function obtenerConsultas() {
  return JSON.parse(localStorage.getItem(KEY_CONSULTAS) || "[]");
}

/**
 * @param {Object} datos 
 * @returns {number} ID generado
 */
export function guardarConsulta(datos) {
  const lista = obtenerConsultas();
  const nueva = {
    id:          Date.now(),
    pacienteId:  datos.pacienteId,   
    fecha:       datos.fecha,
    hora:        datos.hora,
    evolucion:   datos.evolucion.trim(),
    plan:        datos.plan.trim(),
  };
  lista.push(nueva);
  localStorage.setItem(KEY_CONSULTAS, JSON.stringify(lista));
  return nueva.id;
}

/**
 * @param {number} idConsulta
 * @param {Object} nuevosDatos - { fecha, hora, evolucion, plan }
 */
export function actualizarConsulta(idConsulta, nuevosDatos) {
  const lista = obtenerConsultas().map(c => {
    if (c.id === idConsulta) {
      return {
        ...c,
        fecha:     nuevosDatos.fecha,
        hora:      nuevosDatos.hora,
        evolucion: nuevosDatos.evolucion.trim(),
        plan:      nuevosDatos.plan.trim(),
      };
    }
    return c;
  });
  localStorage.setItem(KEY_CONSULTAS, JSON.stringify(lista));
}

/**
 * Elimina una consulta por su ID.
 * @param {number} idConsulta
 */
export function eliminarConsulta(idConsulta) {
  const lista = obtenerConsultas().filter(c => c.id !== idConsulta);
  localStorage.setItem(KEY_CONSULTAS, JSON.stringify(lista));
}

/**
 * @param {number} pacienteId
 * @returns {Array}
 */
export function obtenerConsultasPorPaciente(pacienteId) {
  return obtenerConsultas()
    .filter(c => c.pacienteId === pacienteId)
    .sort((a, b) => b.id - a.id); // más reciente primero
}
