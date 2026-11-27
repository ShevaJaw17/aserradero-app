import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Usuario } from './models/usuario.model';

interface AppPage {
  title: string;
  url: string;
  icon: string;
  roles?: string[];
}

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appPages: AppPage[] = [
    { title: 'Dashboard', url: '/dashboard', icon: 'speedometer' },
    { title: 'Troncos', url: '/troncos', icon: 'cube' },
    { title: 'Producción', url: '/produccion', icon: 'hammer' },
    { title: 'Pedidos', url: '/pedidos', icon: 'cart' },
    { title: 'Facturación', url: '/facturacion', icon: 'receipt' },
    { title: 'Mantenimiento', url: '/mantenimiento', icon: 'construct' },
    { title: 'Despuntador', url: '/despuntador', icon: 'cut', roles: ['operador', 'jefe', 'admin'] },
    { title: 'Bicelador', url: '/bicelador', icon: 'layers', roles: ['operador', 'jefe', 'admin'] },
    { title: 'Mesa de tacos', url: '/mesa-tacos', icon: 'grid', roles: ['operador', 'jefe', 'admin'] },
  ];

  labels: string[] = [];

  constructor(public auth: AuthService) {}

  get visiblePages(): AppPage[] {
    const u = this.auth.currentUser;
    if (!u) return [];
    return this.appPages.filter((p) => !p.roles || p.roles.includes(u.rol));
  }

  pagesFor(user: Usuario | null): AppPage[] {
    if (!user) return [];
    return this.appPages.filter((p) => !p.roles || p.roles.includes(user.rol));
  }

  logout(): void {
    this.auth.logout();
  }
}
