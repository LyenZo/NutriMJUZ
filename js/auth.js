// auth.js
export function guardarSesion(nombre) {
  sessionStorage.setItem("nutriologo", nombre);
}

export function obtenerSesion() {
  return sessionStorage.getItem("nutriologo");
}

export function cerrarSesion() {
  sessionStorage.removeItem("nutriologo");
}

export function verificarAcceso() {
  if (!obtenerSesion()) {
    window.location.href = "index.html";
  }
}