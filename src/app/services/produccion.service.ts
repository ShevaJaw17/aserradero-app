import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Produccion, TipoProducto } from '../models/produccion.model';

const KEY = 'produccion';

@Injectable({ providedIn: 'root' })
export class ProduccionService {
  private subject = new BehaviorSubject<Produccion[]>(this.load().filter((p) => !p.eliminado));
  list$: Observable<Produccion[]> = this.subject.asObservable();

  constructor(private storage: StorageService) {}

  private now(): string { return new Date().toISOString(); }

  private load(): Produccion[] {
    return this.storage.get<Produccion[]>(KEY) || [];
  }

  private persist(list: Produccion[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list.filter((p) => !p.eliminado));
  }

  getAll(): Produccion[] {
    return this.subject.value;
  }

  getAllRaw(): Produccion[] {
    return this.load();
  }

  reload(): void {
    this.subject.next(this.load().filter((p) => !p.eliminado));
  }

  replaceAll(list: Produccion[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list.filter((p) => !p.eliminado));
  }

  create(data: Omit<Produccion, 'id' | 'sincronizado'>): Produccion {
    const item: Produccion = { ...data, id: this.generateId(), sincronizado: false, eliminado: false, updatedAt: this.now() };
    this.persist([item, ...this.load()]);
    return item;
  }

  update(id: string, changes: Partial<Produccion>): void {
    const list = this.load().map((p) =>
      p.id === id ? { ...p, ...changes, sincronizado: false, updatedAt: this.now() } : p
    );
    this.persist(list);
  }

  remove(id: string): void {
    const list = this.load().map((p) =>
      p.id === id ? { ...p, eliminado: true, sincronizado: false, updatedAt: this.now() } : p
    );
    this.persist(list);
  }

  volumenTotal(list: Produccion[] = this.subject.value): number {
    return list.reduce((s, p) => s + (p.volumenM3 || 0), 0);
  }

  porTipo(tipo: TipoProducto): Produccion[] {
    return this.subject.value.filter((p) => p.tipo === tipo);
  }

  pendientesSync(): Produccion[] {
    return this.load().filter((p) => !p.sincronizado);
  }

  marcarSincronizados(ids: string[]): void {
    const set = new Set(ids);
    const list = this.load().map((p) => (set.has(p.id) ? { ...p, sincronizado: true } : p));
    this.persist(list);
  }

  private generateId(): string {
    const c: any = (globalThis as any).crypto;
    const uuid = c && typeof c.randomUUID === 'function' ? c.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    return 'PR-' + uuid;
  }
}
