import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { TrabajoOperador, Maquina } from '../models/operador.model';

const KEY = 'operador_trabajos';

@Injectable({ providedIn: 'root' })
export class OperadorService {
  private subject = new BehaviorSubject<TrabajoOperador[]>(this.load().filter((t) => !t.eliminado));
  list$: Observable<TrabajoOperador[]> = this.subject.asObservable();

  constructor(private storage: StorageService) {}

  private now(): string { return new Date().toISOString(); }
  private load(): TrabajoOperador[] { return this.storage.get<TrabajoOperador[]>(KEY) || []; }
  private persist(list: TrabajoOperador[]): void { this.storage.set(KEY, list); this.subject.next(list.filter((t) => !t.eliminado)); }

  getAll(): TrabajoOperador[] { return this.subject.value; }
  getAllRaw(): TrabajoOperador[] { return this.load(); }
  reload(): void { this.subject.next(this.load().filter((t) => !t.eliminado)); }
  replaceAll(list: TrabajoOperador[]): void { this.storage.set(KEY, list); this.subject.next(list.filter((t) => !t.eliminado)); }

  create(data: Omit<TrabajoOperador, 'id' | 'sincronizado'>): TrabajoOperador {
    const item: TrabajoOperador = { ...data, id: this.generateId(), sincronizado: false, eliminado: false, updatedAt: this.now() };
    this.persist([item, ...this.load()]);
    return item;
  }

  pendientesSync(): TrabajoOperador[] { return this.load().filter((t) => !t.sincronizado); }
  marcarSincronizados(ids: string[]): void {
    const set = new Set(ids);
    const list = this.load().map((t) => (set.has(t.id) ? { ...t, sincronizado: true } : t));
    this.persist(list);
  }

  private generateId(): string {
    const c: any = (globalThis as any).crypto;
    const uuid = c && typeof c.randomUUID === 'function' ? c.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    return 'OP-' + uuid;
  }
}
