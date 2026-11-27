export function itemSubtotal(cantidad: number, precioUnitario: number): number {
  return Math.round(cantidad * precioUnitario * 1000) / 1000;
}

export function calcularTotal(items: { subtotal: number }[]): number {
  return items.reduce((s, i) => s + (i.subtotal || 0), 0);
}

export function calcularTotalesFactura(items: { cantidad: number; precioUnitario: number; subtotal: number }[], impuestoPct: number): { subtotal: number; impuesto: number; total: number } {
  const subtotal = calcularTotal(items);
  const impuesto = Math.round(subtotal * (impuestoPct / 100) * 1000) / 1000;
  return { subtotal, impuesto, total: subtotal + impuesto };
}
