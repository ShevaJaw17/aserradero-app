import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { SyncService } from './sync.service';
import { Tronco, EstadoTronco } from '../models/tronco.model';

const KEY = 'troncos';

@Injectable({ providedIn: 'root' })
export class TroncoService {
  private subject = new BehaviorSubject<Tronco[]>(this.load().filter((t) => !t.eliminado));
  list$: Observable<Tronco[]> = this.subject.asObservable();

  constructor(private storage: StorageService, private sync: SyncService) {}

  private now(): string { return new Date().toISOString(); }

  private load(): Tronco[] {
    return this.storage.get<Tronco[]>(KEY) || [];
  }

  private persist(list: Tronco[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list.filter((t) => !t.eliminado));
  }

  getAll(): Tronco[] {
    return this.subject.value;
  }

  getAllRaw(): Tronco[] {
    return this.load();
  }

  reload(): void {
    this.subject.next(this.load().filter((t) => !t.eliminado));
  }

  replaceAll(list: Tronco[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list.filter((t) => !t.eliminado));
  }

  getById(id: string): Tronco | undefined {
    return this.subject.value.find((t) => t.id === id);
  }

  create(data: Omit<Tronco, 'id' | 'sincronizado'>): Tronco {
    const tronco: Tronco = {
      ...data,
      id: this.generateId(),
      sincronizado: false,
      eliminado: false,
      updatedAt: this.now(),
    };
    this.persist([tronco, ...this.load()]);
    return tronco;
  }

  update(id: string, changes: Partial<Tronco>): void {
    const list = this.load().map((t) =>
      t.id === id ? { ...t, ...changes, sincronizado: false, updatedAt: this.now() } : t
    );
    this.persist(list);
  }

  remove(id: string): void {
    const list = this.load().map((t) =>
      t.id === id ? { ...t, eliminado: true, sincronizado: false, updatedAt: this.now() } : t
    );
    this.persist(list);
  }

  cambiarEstado(id: string, estado: EstadoTronco): void {
    this.update(id, { estado });
  }

  pendientesSync(): Tronco[] {
    return this.load().filter((t) => !t.sincronizado);
  }

  marcarSincronizados(ids: string[]): void {
    const set = new Set(ids);
    const list = this.load().map((t) => (set.has(t.id) ? { ...t, sincronizado: true } : t));
    this.persist(list);
  }

  volumenTotal(list: Tronco[] = this.subject.value): number {
    return list.reduce((s, t) => s + (t.volumenM3 || 0), 0);
  }

  private generateId(): string {
    const c: any = (globalThis as any).crypto;
    const uuid = c && typeof c.randomUUID === 'function' ? c.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    return 'TR-' + uuid;
  }
}
