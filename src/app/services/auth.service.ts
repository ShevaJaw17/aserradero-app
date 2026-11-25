import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Usuario, RolUsuario } from '../models/usuario.model';

const USERS: { usuario: string; password: string; nombre: string; rol: RolUsuario }[] = [
  { usuario: 'operador', password: 'operador', nombre: 'Operador Demo', rol: 'operador' },
  { usuario: 'jefe', password: 'jefe', nombre: 'Jefe de Planta', rol: 'jefe' },
  { usuario: 'admin', password: 'admin', nombre: 'Administrador', rol: 'admin' },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<Usuario | null>(this.loadUser());
  user$: Observable<Usuario | null> = this.userSubject.asObservable();

  constructor(private storage: StorageService) {}

  private loadUser(): Usuario | null {
    return this.storage.get<Usuario>('user');
  }

  get currentUser(): Usuario | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  login(usuario: string, password: string): boolean {
    const found = USERS.find((u) => u.usuario === usuario && u.password === password);
    if (!found) return false;
    const user: Usuario = {
      id: found.usuario,
      nombre: found.nombre,
      usuario: found.usuario,
      rol: found.rol,
    };
    this.storage.set('user', user);
    this.userSubject.next(user);
    return true;
  }

  logout(): void {
    this.storage.remove('user');
    this.userSubject.next(null);
  }

  hasRole(roles: RolUsuario[]): boolean {
    const u = this.userSubject.value;
    return !!u && roles.includes(u.rol);
  }
}
