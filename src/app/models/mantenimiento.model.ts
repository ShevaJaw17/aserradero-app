export type TipoMantenimiento = 'preventivo' | 'correctivo';
export type EstadoMantenimiento = 'programado' | 'en_proceso' | 'completado';

export interface Mantenimiento {
  id: string;
  maquina: string;
  tipo: TipoMantenimiento;
  fecha: string;
  descripcion: string;
  responsable: string;
  costo: number;
  proximoServicio?: string;
  estado: EstadoMantenimiento;
  sincronizado: boolean;
}
