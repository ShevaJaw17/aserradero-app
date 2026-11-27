export type TipoProducto = 'tabla' | 'viga' | 'vigueta' | 'liston' | 'otro';

export interface Produccion {
  id: string;
  fecha: string;
  troncoId?: string;
  tipo: TipoProducto;
  especie: string;
  espesorCm: number;
  anchoCm: number;
  largoM: number;
  cantidad: number;
  volumenM3: number;
  operador: string;
  turno?: string;
   sincronizado: boolean;
   eliminado?: boolean;
   updatedAt?: string;
}
