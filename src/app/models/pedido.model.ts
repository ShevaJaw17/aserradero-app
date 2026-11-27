export type EstadoPedido = 'pendiente' | 'en_proceso' | 'entregado' | 'cancelado';

export interface ItemPedido {
  producto: string;
  especie?: string;
  dimensiones?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  numero: string;
  cliente: string;
  telefono?: string;
  fecha: string;
  items: ItemPedido[];
  total: number;
  estado: EstadoPedido;
  notas?: string;
   sincronizado: boolean;
   eliminado?: boolean;
   updatedAt?: string;
}
