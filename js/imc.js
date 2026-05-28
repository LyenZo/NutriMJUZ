// imc.js
export function calcularIMC(peso, altura) {
  return peso / (altura * altura);
}

export function diagnosticar(imc) {
  if (imc < 18.5) return "Bajo peso";
  if (imc < 25)   return "Peso normal";
  if (imc < 30)   return "Sobrepeso";
  return "Obesidad";
}