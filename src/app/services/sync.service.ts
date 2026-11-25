import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

/**
 * Punto de integracion con la nube.
 * En produccion, reemplazar los metodos de push/pull por llamadas HTTP
 * a la API del backend (Firebase, Supabase, REST propio, etc.).
 */
@Injectable({ providedIn: 'root' })
export class SyncService {
  private lastSyncKey = 'last_sync';

  constructor(private storage: StorageService) {}

  get lastSync(): string | null {
    return this.storage.get<string>(this.lastSyncKey);
  }

  /**
   * Sincroniza los registros pendientes (sincronizado === false).
   * Devuelve la cantidad de registros enviados.
   */
  async syncPending(pushFn: () => Promise<number>): Promise<{ sent: number; ok: boolean }> {
    try {
      const sent = await pushFn();
      this.storage.set(this.lastSyncKey, new Date().toISOString());
      return { sent, ok: true };
    } catch (e) {
      console.error('SyncService.syncPending error', e);
      return { sent: 0, ok: false };
    }
  }

  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }
}
