

/**
 
 * @param {number} 
 * @param {number} 
 * @returns {number} 
 */
export function calcularIMC(peso, altura) {
  if (!peso || !altura || altura <= 0) return 0;
  return parseFloat((peso / (altura * altura)).toFixed(2));
}

/**
 
 * @param {number} imc
 * @returns {string}
 */
export function diagnosticar(imc) {
  if (imc <= 0)    return "Sin datos";
  if (imc < 18.5)  return "Bajo peso";
  if (imc < 25)    return "Peso normal";
  if (imc < 30)    return "Sobrepeso";
  return "Obesidad";
}

/**
 * @param {string} diagnostico
 * @returns {string}
 */
export function claseDiagnostico(diagnostico) {
  const mapa = {
    "Bajo peso":    "bajo-peso",
    "Peso normal":  "peso-normal",
    "Sobrepeso":    "sobrepeso",
    "Obesidad":     "obesidad",
  };
  return mapa[diagnostico] || "";
}
