import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

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
  ];

  labels: string[] = [];

  constructor(public auth: AuthService) {}

  get visiblePages(): AppPage[] {
    const u = this.auth.currentUser;
    if (!u) return [];
    return this.appPages;
  }

  logout(): void {
    this.auth.logout();
  }
}
