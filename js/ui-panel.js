/**
 * ui-panel.js
 * Maneja exclusivamente el DOM de panel.html.
 * Importa todo desde los módulos especializados.
 */

import { verificarAcceso, obtenerSesion, cerrarSesion } from "./auth.js";
import { calcularIMC, diagnosticar, claseDiagnostico }  from "./imc.js";
import {
  obtenerPacientes,
  guardarPaciente,
  obtenerPacientePorId,
  guardarConsulta,
  actualizarConsulta,
  eliminarConsulta,
  obtenerConsultasPorPaciente,
  borrarTodosLosDatos,
} from "./storage.js";

// ─── GUARDIA DE ACCESO (lo primero que corre) ────────────────────────────────
verificarAcceso();

// ─── REFERENCIAS AL DOM ──────────────────────────────────────────────────────
const bienvenida          = document.getElementById("bienvenida");
const btnLogout           = document.getElementById("btn-logout");
const btnReset            = document.getElementById("btn-reset");
const modalReset          = document.getElementById("modal-reset");
const btnConfirmarReset   = document.getElementById("btn-confirmar-reset");
const btnCancelarReset    = document.getElementById("btn-cancelar-reset");

// Formulario paciente
const formPaciente        = document.getElementById("form-paciente");
const inputNombre         = document.getElementById("pac-nombre");
const inputEdad           = document.getElementById("pac-edad");
const inputSexo           = document.getElementById("pac-sexo");
const inputPeso           = document.getElementById("pac-peso");
const inputAltura         = document.getElementById("pac-altura");
const imcPreview          = document.getElementById("imc-preview");
const imcValorEl          = document.getElementById("imc-valor");
const imcDiagEl           = document.getElementById("imc-diag");
const msgPaciente         = document.getElementById("msg-paciente");

// Formulario consulta
const formConsulta        = document.getElementById("form-consulta");
const selPaciente         = document.getElementById("sel-paciente");
const infoPaciente        = document.getElementById("info-paciente");
const chipEdad            = document.getElementById("chip-edad");
const chipPeso            = document.getElementById("chip-peso");
const chipIMC             = document.getElementById("chip-imc");
const chipDiag            = document.getElementById("chip-diag");
const consFecha           = document.getElementById("cons-fecha");
const consHora            = document.getElementById("cons-hora");
const consEvolucion       = document.getElementById("cons-evolucion");
const consPlan            = document.getElementById("cons-plan");
const consEditId          = document.getElementById("cons-edit-id");
const btnGuardarConsulta  = document.getElementById("btn-guardar-consulta");
const btnCancelarEdicion  = document.getElementById("btn-cancelar-edicion");
const msgConsulta         = document.getElementById("msg-consulta");

// Historial
const historialContainer  = document.getElementById("historial-container");
const nombreHistorial     = document.getElementById("nombre-historial");

// ─── INICIALIZACIÓN ──────────────────────────────────────────────────────────
bienvenida.textContent = `Sesión: ${obtenerSesion()}`;
rellenarSelectPacientes();
setFechaHoraActual();

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
btnLogout.addEventListener("click", () => {
  cerrarSesion();
  window.location.href = "./index.html";
});

// ─── BORRAR TODOS LOS DATOS ──────────────────────────────────────────────────
btnReset.addEventListener("click", () => {
  modalReset.classList.remove("hidden");
});

btnCancelarReset.addEventListener("click", () => {
  modalReset.classList.add("hidden");
});

// Cerrar modal al hacer clic fuera del cuadro
modalReset.addEventListener("click", (e) => {
  if (e.target === modalReset) modalReset.classList.add("hidden");
});

btnConfirmarReset.addEventListener("click", () => {
  borrarTodosLosDatos();
  modalReset.classList.add("hidden");

  // Resetear toda la UI al estado inicial
  formPaciente.reset();
  formConsulta.reset();
  imcPreview.classList.add("hidden");
  infoPaciente.classList.add("hidden");
  consEditId.value = "";
  btnGuardarConsulta.textContent = "Guardar Consulta";
  btnCancelarEdicion.classList.add("hidden");
  nombreHistorial.textContent = "";
  historialContainer.innerHTML = `<p class="empty-state">Selecciona un paciente para ver su historial.</p>`;
  rellenarSelectPacientes();
  setFechaHoraActual();
  mostrarMensaje(msgPaciente, "✓ Todos los datos han sido eliminados.");
});

// ─── IMC EN TIEMPO REAL ──────────────────────────────────────────────────────
[inputPeso, inputAltura].forEach(el => {
  el.addEventListener("input", actualizarIMCPreview);
});

function actualizarIMCPreview() {
  const peso   = parseFloat(inputPeso.value);
  const altura = parseFloat(inputAltura.value);

  if (!peso || !altura || altura <= 0) {
    imcPreview.classList.add("hidden");
    return;
  }

  const imc  = calcularIMC(peso, altura);
  const diag = diagnosticar(imc);

  imcValorEl.textContent = imc;
  imcDiagEl.textContent  = diag;
  imcDiagEl.className    = `imc-badge ${claseDiagnostico(diag)}`;
  imcPreview.classList.remove("hidden");
}

// ─── GUARDAR PACIENTE ────────────────────────────────────────────────────────
formPaciente.addEventListener("submit", (e) => {
  e.preventDefault();

  const peso   = parseFloat(inputPeso.value);
  const altura = parseFloat(inputAltura.value);
  const imc    = calcularIMC(peso, altura);
  const diag   = diagnosticar(imc);

  guardarPaciente({
    nombre:      inputNombre.value,
    edad:        inputEdad.value,
    sexo:        inputSexo.value,
    peso,
    altura,
    imc,
    diagnostico: diag,
  });

  mostrarMensaje(msgPaciente, `✓ Paciente "${inputNombre.value.trim()}" registrado correctamente.`);
  formPaciente.reset();
  imcPreview.classList.add("hidden");
  rellenarSelectPacientes();
});

// ─── SELECT DE PACIENTE → INFO + HISTORIAL ───────────────────────────────────
selPaciente.addEventListener("change", () => {
  const id = parseInt(selPaciente.value, 10);
  if (!id) {
    infoPaciente.classList.add("hidden");
    historialContainer.innerHTML = `<p class="empty-state">Selecciona un paciente para ver su historial.</p>`;
    nombreHistorial.textContent  = "";
    return;
  }

  const paciente = obtenerPacientePorId(id);
  if (!paciente) return;

  chipEdad.textContent = `${paciente.edad} años • ${paciente.sexo}`;
  chipPeso.textContent = `${paciente.peso} kg / ${paciente.altura} m`;
  chipIMC.textContent  = `IMC: ${paciente.imc}`;
  chipDiag.textContent = paciente.diagnostico;
  infoPaciente.classList.remove("hidden");

  nombreHistorial.textContent = paciente.nombre;
  renderizarHistorial(id);
});

// ─── GUARDAR / ACTUALIZAR CONSULTA ───────────────────────────────────────────
formConsulta.addEventListener("submit", (e) => {
  e.preventDefault();

  const pacienteId = parseInt(selPaciente.value, 10);
  if (!pacienteId) {
    alert("Selecciona un paciente primero.");
    return;
  }

  const editId = parseInt(consEditId.value, 10);

  const datosCons = {
    pacienteId,
    fecha:     consFecha.value,
    hora:      consHora.value,
    evolucion: consEvolucion.value,
    plan:      consPlan.value,
  };

  if (editId) {
    actualizarConsulta(editId, datosCons);
    mostrarMensaje(msgConsulta, "✓ Consulta actualizada correctamente.");
    salirModoEdicion();
  } else {
    guardarConsulta(datosCons);
    mostrarMensaje(msgConsulta, "✓ Consulta guardada correctamente.");
    formConsulta.reset();
    rellenarSelectPacientes();
    selPaciente.value = pacienteId;
    selPaciente.dispatchEvent(new Event("change"));
    setFechaHoraActual();
  }

  renderizarHistorial(pacienteId);
});

btnCancelarEdicion.addEventListener("click", salirModoEdicion);

// ─── RENDERIZADO DE HISTORIAL ────────────────────────────────────────────────
function renderizarHistorial(pacienteId) {
  const consultas = obtenerConsultasPorPaciente(pacienteId);

  if (consultas.length === 0) {
    historialContainer.innerHTML = `<p class="empty-state">No hay consultas registradas para este paciente.</p>`;
    return;
  }

  historialContainer.innerHTML = consultas.map(c => `
    <div class="consulta-card" data-id="${c.id}">
      <div class="consulta-header">
        <span class="consulta-fecha">${formatearFecha(c.fecha)}</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="consulta-hora">🕐 ${c.hora}</span>
          <div class="consulta-actions">
            <button class="btn-editar"   data-id="${c.id}">Editar</button>
            <button class="btn-eliminar" data-id="${c.id}">Eliminar</button>
          </div>
        </div>
      </div>
      <div class="consulta-body">
        <div class="consulta-seccion">
          <label>Evolución del paciente</label>
          <p>${escaparHTML(c.evolucion)}</p>
        </div>
        <div class="consulta-seccion">
          <label>Plan de alimentación</label>
          <p>${escaparHTML(c.plan)}</p>
        </div>
      </div>
    </div>
  `).join("");

  historialContainer.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", () => cargarConsultaParaEdicion(parseInt(btn.dataset.id, 10)));
  });

  historialContainer.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", () => {
      if (confirm("¿Eliminar esta consulta?")) {
        eliminarConsulta(parseInt(btn.dataset.id, 10));
        renderizarHistorial(pacienteId);
      }
    });
  });
}

// ─── MODO EDICIÓN ────────────────────────────────────────────────────────────
function cargarConsultaParaEdicion(idConsulta) {
  const consultas = obtenerConsultasPorPaciente(parseInt(selPaciente.value, 10));
  const consulta  = consultas.find(c => c.id === idConsulta);
  if (!consulta) return;

  consFecha.value      = consulta.fecha;
  consHora.value       = consulta.hora;
  consEvolucion.value  = consulta.evolucion;
  consPlan.value       = consulta.plan;

  consEditId.value = idConsulta;
  btnGuardarConsulta.textContent = "💾 Guardar Cambios";
  btnCancelarEdicion.classList.remove("hidden");

  formConsulta.scrollIntoView({ behavior: "smooth", block: "start" });
}

function salirModoEdicion() {
  consEditId.value = "";
  btnGuardarConsulta.textContent = "Guardar Consulta";
  btnCancelarEdicion.classList.add("hidden");
  formConsulta.reset();
  setFechaHoraActual();
  msgConsulta.classList.add("hidden");
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function rellenarSelectPacientes() {
  const pacientes   = obtenerPacientes();
  const valorActual = selPaciente.value;

  selPaciente.innerHTML = `<option value="">— Selecciona un paciente —</option>`;
  pacientes.forEach(p => {
    const opt = document.createElement("option");
    opt.value       = p.id;
    opt.textContent = `${p.nombre} (${p.diagnostico})`;
    selPaciente.appendChild(opt);
  });

  if (valorActual) selPaciente.value = valorActual;
}

function setFechaHoraActual() {
  const ahora     = new Date();
  consFecha.value = ahora.toISOString().split("T")[0];
  consHora.value  = ahora.toTimeString().slice(0, 5);
}

function formatearFecha(fechaStr) {
  const [y, m, d] = fechaStr.split("-");
  const meses = ["enero","febrero","marzo","abril","mayo","junio",
                  "julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${y}`;
}

function escaparHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

function mostrarMensaje(el, texto) {
  el.textContent = texto;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 3000);
}
