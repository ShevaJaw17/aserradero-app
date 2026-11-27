export type EstadoFactura = 'pendiente' | 'pagada' | 'anulada';

export interface ItemFactura {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Factura {
  id: string;
  numero: string;
  pedidoId?: string;
  cliente: string;
  fecha: string;
  items: ItemFactura[];
  subtotal: number;
  impuesto: number;
  total: number;
  estado: EstadoFactura;
  metodoPago?: string;
   sincronizado: boolean;
   eliminado?: boolean;
   updatedAt?: string;
}
