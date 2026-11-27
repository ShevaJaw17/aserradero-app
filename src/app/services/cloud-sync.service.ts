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
import { ToastService } from './toast.service';
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
    private mantenimientos: MantenimientoService,
    private toast: ToastService
  ) {}

  private headers(): HttpHeaders {
    const token = this.auth.token;
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  private url(path: string): string {
    return `${environment.apiUrl}${path}`;
  }

  private merge(local: any[], server: any[]): any[] {
    const localMap = new Map(local.map((x) => [x.id, x]));
    const merged: any[] = [];
    const serverIds = new Set(server.map((x: any) => x.id));
    for (const s of server) {
      const l = localMap.get(s.id);
      if (l && !l.sincronizado) {
        const lu = l.updatedAt || '';
        const su = (s as any).updatedAt || '';
        if (lu > su) {
          merged.push({ ...l });
          continue;
        }
      }
      merged.push({ ...s, sincronizado: true });
    }
    for (const l of local) {
      if (!serverIds.has(l.id) && !l.sincronizado) {
        merged.push({ ...l });
      }
    }
    return merged;
  }

  async syncAll(): Promise<{ ok: boolean; message: string }> {
    if (!this.auth.token) {
      return { ok: false, message: 'Sin sesion en la nube. Inicia sesion online.' };
    }
    try {
      const payload = {
        troncos: this.troncos.pendientesSync(),
        produccion: this.produccion.pendientesSync(),
        pedidos: this.pedidos.pendientesSync(),
        facturas: this.facturas.pendientesSync(),
        mantenimientos: this.mantenimientos.pendientesSync(),
      };
      await firstValueFrom(this.http.post(this.url('/sync'), payload, { headers: this.headers() }));

      const [troncos, produccion, pedidos, facturas, mantenimientos] = await Promise.all([
        firstValueFrom(this.http.get<any[]>(this.url('/troncos'), { headers: this.headers() })),
        firstValueFrom(this.http.get<any[]>(this.url('/produccion'), { headers: this.headers() })),
        firstValueFrom(this.http.get<any[]>(this.url('/pedidos'), { headers: this.headers() })),
        firstValueFrom(this.http.get<any[]>(this.url('/facturas'), { headers: this.headers() })),
        firstValueFrom(this.http.get<any[]>(this.url('/mantenimientos'), { headers: this.headers() })),
      ]);

      this.troncos.replaceAll(this.merge(this.troncos.getAllRaw(), troncos));
      this.produccion.replaceAll(this.merge(this.produccion.getAllRaw(), produccion));
      this.pedidos.replaceAll(this.merge(this.pedidos.getAllRaw(), pedidos));
      this.facturas.replaceAll(this.merge(this.facturas.getAllRaw(), facturas));
      this.mantenimientos.replaceAll(this.merge(this.mantenimientos.getAllRaw(), mantenimientos));

      this.storage.set('last_sync', new Date().toISOString());
      this.toast.success('Sincronización completada');
      return { ok: true, message: 'Sincronizacion completada' };
    } catch (e: any) {
      console.error('CloudSyncService.syncAll error', e);
      this.toast.error(e?.message || 'Error al sincronizar');
      return { ok: false, message: e?.message || 'Error al sincronizar' };
    }
  }

  lastSync(): string | null {
    return this.storage.get<string>('last_sync') || this.storage.get<string>('aserradero_last_sync');
  }
}
