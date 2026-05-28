

import { guardarSesion, obtenerSesion } from "./auth.js";

if (obtenerSesion()) {
  window.location.href = "./panel.html";
}

const formLogin        = document.getElementById("form-login");
const inputNombre      = document.getElementById("nombre-nutriologo");
const errorLogin       = document.getElementById("error-login");

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = inputNombre.value.trim();

  if (!nombre) {
    errorLogin.classList.remove("hidden");
    inputNombre.focus();
    return;
  }

  errorLogin.classList.add("hidden");
  guardarSesion(nombre);
  window.location.href = "./panel.html";
});

// Ocultar error mientras el usuario escribe
inputNombre.addEventListener("input", () => {
  errorLogin.classList.add("hidden");
});
