import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Mantenimiento, EstadoMantenimiento } from '../models/mantenimiento.model';

const KEY = 'mantenimientos';

@Injectable({ providedIn: 'root' })
export class MantenimientoService {
  private subject = new BehaviorSubject<Mantenimiento[]>(this.load().filter((m) => !m.eliminado));
  list$: Observable<Mantenimiento[]> = this.subject.asObservable();

  constructor(private storage: StorageService) {}

  private now(): string { return new Date().toISOString(); }

  private load(): Mantenimiento[] {
    return this.storage.get<Mantenimiento[]>(KEY) || [];
  }

  private persist(list: Mantenimiento[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list.filter((m) => !m.eliminado));
  }

  getAll(): Mantenimiento[] {
    return this.subject.value;
  }

  getAllRaw(): Mantenimiento[] {
    return this.load();
  }

  reload(): void {
    this.subject.next(this.load().filter((m) => !m.eliminado));
  }

  replaceAll(list: Mantenimiento[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list.filter((m) => !m.eliminado));
  }

  create(data: Omit<Mantenimiento, 'id' | 'sincronizado'>): Mantenimiento {
    const item: Mantenimiento = { ...data, id: this.generateId(), sincronizado: false, eliminado: false, updatedAt: this.now() };
    this.persist([item, ...this.load()]);
    return item;
  }

  update(id: string, changes: Partial<Mantenimiento>): void {
    const list = this.load().map((m) =>
      m.id === id ? { ...m, ...changes, sincronizado: false, updatedAt: this.now() } : m
    );
    this.persist(list);
  }

  cambiarEstado(id: string, estado: EstadoMantenimiento): void {
    this.update(id, { estado });
  }

  remove(id: string): void {
    const list = this.load().map((m) =>
      m.id === id ? { ...m, eliminado: true, sincronizado: false, updatedAt: this.now() } : m
    );
    this.persist(list);
  }

  costoTotal(): number {
    return this.subject.value.reduce((s, m) => s + (m.costo || 0), 0);
  }

  pendientesSync(): Mantenimiento[] {
    return this.load().filter((m) => !m.sincronizado);
  }

  marcarSincronizados(ids: string[]): void {
    const set = new Set(ids);
    const list = this.load().map((m) => (set.has(m.id) ? { ...m, sincronizado: true } : m));
    this.persist(list);
  }

  private generateId(): string {
    const c: any = (globalThis as any).crypto;
    const uuid = c && typeof c.randomUUID === 'function' ? c.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    return 'MT-' + uuid;
  }
}
