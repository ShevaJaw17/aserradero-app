export type RolUsuario = 'operador' | 'jefe' | 'admin';

export interface Usuario {
  id: string;
  nombre: string;
  usuario: string;
  rol: RolUsuario;
}
