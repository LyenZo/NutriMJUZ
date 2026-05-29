# Nutri MJUZ — Sistema Clínico Nutricional

Sistema web local para nutriólogos que permite gestionar pacientes, calcular IMC automáticamente y llevar un historial de consultas cronológico. Desarrollado como práctica académica de la Unidad 2 (Control de Versiones / Web Storage).

---

## Funcionalidades

- **Login con sesión temporal** — La sesión se guarda en `sessionStorage` y se borra al cerrar la pestaña. Acceder directamente a `panel.html` sin iniciar sesión redirige automáticamente al login.
- **Registro de pacientes** — Preregistro antropométrico con cálculo de IMC en tiempo real y diagnóstico automático (Bajo peso / Peso normal / Sobrepeso / Obesidad).
- **Historial de consultas** — Cada consulta se vincula al paciente por ID sin duplicar datos. Las notas aparecen ordenadas de más reciente a más antigua y se actualizan en pantalla sin recargar la página.
- **Edición de consultas** — El botón "Editar" carga los datos en el formulario, cambia el texto del botón a "Guardar Cambios" y actualiza el registro sin crear duplicados.

---

## Tecnologías

- HTML5, CSS3, JavaScript ES Modules (`import/export` nativos)
- `sessionStorage` para la sesión del nutriólogo
- `localStorage` para pacientes y consultas (datos permanentes)
- Sin frameworks, sin dependencias externas

---

## Estructura del proyecto

```
nutri-MFL/
├── index.html          # Pantalla de login
├── panel.html          # Panel principal
├── css/
│   └── styles.css
└── js/
    ├── auth.js         # Lógica de sesión
    ├── imc.js          # Cálculo de IMC y diagnóstico
    ├── storage.js      # CRUD de pacientes y consultas
    ├── ui-login.js     # DOM de index.html
    └── ui-panel.js     # DOM de panel.html
```

---

## Cómo ejecutar localmente

Los ES Modules requieren un servidor HTTP. No abrir los archivos directamente desde el explorador (`file://`).

**Opción 1 — VS Code:**
Instalar la extensión **Live Server**, clic derecho en `index.html` → *Open with Live Server*.

**Opción 2 — Terminal:**
```bash
python -m http.server 8000
```
Luego abrir `http://localhost:8000` en el navegador.

---

## Demo en producción

https://nutri-mjuz.vercel.app/

## Repositorio

https://github.com/LyenZo/NutriMJUZ
