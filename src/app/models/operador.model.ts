export type Maquina = 'despuntador' | 'bicelador' | 'mesa_tacos';

export interface TrabajoOperador {
  id: string;
  maquina: Maquina;
  fecha: string;
  cantidadReglas: number;
  largo: number;
  ancho: number;
  grosor: number;
  tipoTarima: string;
  bicelado?: boolean;
  dimensiones?: string;
  sincronizado: boolean;
  eliminado?: boolean;
  updatedAt?: string;
}
