/**
 * Formateador de moneda exclusivo en Pesos Argentinos (ARS)
 * Ejemplo: 185000 -> "$ 185.000"
 */
export function formatARS(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$ 0';
  }
  return `$ ${Math.round(amount).toLocaleString('es-AR')}`;
}
