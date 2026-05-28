
const SESSION_KEY = "nutriologo_sesion";

/*
 * @param {string} nombre
 */
export function guardarSesion(nombre) {
  sessionStorage.setItem(SESSION_KEY, nombre.trim());
}

/**
@returns {string|null}
 */
export function obtenerSesion() {
  return sessionStorage.getItem(SESSION_KEY);
}


export function cerrarSesion() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function verificarAcceso() {
  if (!obtenerSesion()) {
    window.location.href = "./index.html";
  }
}
