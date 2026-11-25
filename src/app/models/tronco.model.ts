export type EstadoTronco = 'en_patio' | 'en_proceso' | 'procesado' | 'vendido';

export interface Tronco {
  id: string;
  fechaIngreso: string; // ISO date
  especie: string;
  diametroCm: number;
  longitudM: number;
  volumenM3: number;
  proveedor?: string;
  ubicacion?: string;
  estado: EstadoTronco;
  notas?: string;
  sincronizado: boolean;
}
