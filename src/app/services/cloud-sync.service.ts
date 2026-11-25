import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { TroncoService } from './tronco.service';
import { ProduccionService } from './produccion.service';
import { PedidoService } from './pedido.service';
import { FacturaService } from './factura.service';
import { MantenimientoService } from './mantenimiento.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CloudSyncService {
  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private auth: AuthService,
    private troncos: TroncoService,
    private produccion: ProduccionService,
    private pedidos: PedidoService,
    private facturas: FacturaService,
    private mantenimientos: MantenimientoService
  ) {}

  private headers(): HttpHeaders {
    const token = this.auth.token;
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  private url(path: string): string {
    return `${environment.apiUrl}${path}`;
  }

  async syncAll(): Promise<{ ok: boolean; message: string }> {
    if (!this.auth.token) {
      // intentar login con credenciales guardadas? si no, fallar
      return { ok: false, message: 'Sin sesion en la nube. Inicia sesion online.' };
    }
    try {
      // 1. Push: enviar todos los registros locales
      const payload = {
        troncos: this.troncos.getAll(),
        produccion: this.produccion.getAll(),
        pedidos: this.pedidos.getAll(),
        facturas: this.facturas.getAll(),
        mantenimientos: this.mantenimientos.getAll(),
      };
      await firstValueFrom(this.http.post(this.url('/sync'), payload, { headers: this.headers() }));

      // 2. Pull: obtener estado actual del servidor
      const [troncos, produccion, pedidos, facturas, mantenimientos] = await Promise.all([
        firstValueFrom(this.http.get<any[]>(this.url('/troncos'), { headers: this.headers() })),
        firstValueFrom(this.http.get<any[]>(this.url('/produccion'), { headers: this.headers() })),
        firstValueFrom(this.http.get<any[]>(this.url('/pedidos'), { headers: this.headers() })),
        firstValueFrom(this.http.get<any[]>(this.url('/facturas'), { headers: this.headers() })),
        firstValueFrom(this.http.get<any[]>(this.url('/mantenimientos'), { headers: this.headers() })),
      ]);

      this.storage.set('troncos', troncos.map((t) => ({ ...t, sincronizado: true })));
      this.storage.set('produccion', produccion.map((p) => ({ ...p, sincronizado: true })));
      this.storage.set('pedidos', pedidos.map((p) => ({ ...p, sincronizado: true })));
      this.storage.set('facturas', facturas.map((f) => ({ ...f, sincronizado: true })));
      this.storage.set('mantenimientos', mantenimientos.map((m) => ({ ...m, sincronizado: true })));

      this.troncos.reload();
      this.produccion.reload();
      this.pedidos.reload();
      this.facturas.reload();
      this.mantenimientos.reload();

      this.storage.set('last_sync', new Date().toISOString());
      return { ok: true, message: 'Sincronizacion completada' };
    } catch (e: any) {
      console.error('CloudSyncService.syncAll error', e);
      return { ok: false, message: e?.message || 'Error al sincronizar' };
    }
  }

  lastSync(): string | null {
    return this.storage.get<string>('last_sync') || this.storage.get<string>('aserradero_last_sync');
  }
}
