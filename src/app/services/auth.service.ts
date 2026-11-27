import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { Usuario, RolUsuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  user: { id: string; nombre: string; usuario: string; rol: RolUsuario };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<Usuario | null>(this.loadUser());
  user$: Observable<Usuario | null> = this.userSubject.asObservable();

  constructor(private storage: StorageService, private http: HttpClient, private router: Router) {
    if (this.token) {
      this.validateSession().subscribe();
    }
  }

  private loadUser(): Usuario | null {
    const token = this.storage.get<string>('token');
    if (!token) {
      this.storage.remove('user');
      return null;
    }
    return this.storage.get<Usuario>('user');
  }

  get currentUser(): Usuario | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.userSubject.value && !!this.token;
  }

  get token(): string | null {
    return this.storage.get<string>('token');
  }

  login(usuario: string, password: string): Observable<boolean> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { usuario, password }).pipe(
      map((res) => {
        if (res?.token && res?.user) {
          const user: Usuario = {
            id: res.user.id,
            nombre: res.user.nombre,
            usuario: res.user.usuario,
            rol: res.user.rol,
          };
          this.storage.set('user', user);
          this.storage.set('token', res.token);
          this.userSubject.next(user);
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  private authHeaders(): HttpHeaders {
    const token = this.token;
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  validateSession(): Observable<boolean> {
    if (!this.token) {
      this.logout();
      return of(false);
    }
    return this.http.get<{ user: { id: string; nombre: string; usuario: string; rol: RolUsuario } }>(
      `${environment.apiUrl}/auth/me`,
      { headers: this.authHeaders() }
    ).pipe(
      map((res) => {
        if (res?.user) {
          const user: Usuario = {
            id: res.user.id,
            nombre: res.user.nombre,
            usuario: res.user.usuario,
            rol: res.user.rol,
          };
          this.storage.set('user', user);
          this.userSubject.next(user);
          return true;
        }
        this.logout();
        return false;
      }),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  logout(): void {
    this.storage.remove('user');
    this.storage.remove('token');
    this.userSubject.next(null);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  hasRole(roles: RolUsuario[]): boolean {
    const u = this.userSubject.value;
    return !!u && roles.includes(u.rol);
  }
}
