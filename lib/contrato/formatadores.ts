import extenso from "extenso";

/** Formata 250 → "250,00" */
export function formatarValor(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** 250 → "duzentos e cinquenta reais" */
export function valorPorExtenso(valor: number): string {
  return extenso(valor.toFixed(2).replace(".", ","), {
    mode: "currency",
    currency: { type: "BRL" },
  });
}

/** 10 → "dez" */
export function diaPorExtenso(dia: number): string {
  return extenso(dia, { mode: "number" });
}

/** "2026-06-12" → "12/06/2026" (sem fuso: trata como data local) */
export function formatarData(dataISO: string): string {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

/** "2026-06-12" → "12 de junho de 2026" */
export function formatarDataLonga(dataISO: string): string {
  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  return `${dia.toString().padStart(2, "0")} de ${meses[mes - 1]} de ${ano}`;
}
