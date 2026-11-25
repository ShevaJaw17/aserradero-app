import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Usuario, RolUsuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';

const USERS: { usuario: string; password: string; nombre: string; rol: RolUsuario }[] = [
  { usuario: 'operador', password: 'operador', nombre: 'Operador Demo', rol: 'operador' },
  { usuario: 'jefe', password: 'jefe', nombre: 'Jefe de Planta', rol: 'jefe' },
  { usuario: 'admin', password: 'admin', nombre: 'Administrador', rol: 'admin' },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<Usuario | null>(this.loadUser());
  user$: Observable<Usuario | null> = this.userSubject.asObservable();

  constructor(private storage: StorageService, private http: HttpClient) {}

  private loadUser(): Usuario | null {
    return this.storage.get<Usuario>('user');
  }

  get currentUser(): Usuario | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  get token(): string | null {
    return this.storage.get<string>('token');
  }

  login(usuario: string, password: string): boolean {
    const found = USERS.find((u) => u.usuario === usuario && u.password === password);
    if (!found) return false;
    const user: Usuario = { id: found.usuario, nombre: found.nombre, usuario: found.usuario, rol: found.rol };
    this.storage.set('user', user);
    this.userSubject.next(user);
    this.loginCloud(usuario, password).subscribe({
      next: (res: any) => { if (res?.token) this.storage.set('token', res.token); },
      error: () => {},
    });
    return true;
  }

  loginCloud(usuario: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, { usuario, password });
  }

  loginAsync(usuario: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { usuario, password }).pipe(
      map((res: any) => {
        if (res?.token && res?.user) {
          const user: Usuario = { id: res.user.id, nombre: res.user.nombre, usuario: res.user.usuario, rol: res.user.rol };
          this.storage.set('user', user);
          this.storage.set('token', res.token);
          this.userSubject.next(user);
          return true;
        }
        return this.login(usuario, password);
      }),
      catchError(() => {
        const ok = this.login(usuario, password);
        return of(ok);
      })
    );
  }

  logout(): void {
    this.storage.remove('user');
    this.storage.remove('token');
    this.userSubject.next(null);
  }

  hasRole(roles: RolUsuario[]): boolean {
    const u = this.userSubject.value;
    return !!u && roles.includes(u.rol);
  }
}
