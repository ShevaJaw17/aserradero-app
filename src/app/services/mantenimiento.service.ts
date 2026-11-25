import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Mantenimiento, EstadoMantenimiento } from '../models/mantenimiento.model';

const KEY = 'mantenimientos';

@Injectable({ providedIn: 'root' })
export class MantenimientoService {
  private subject = new BehaviorSubject<Mantenimiento[]>(this.load());
  list$: Observable<Mantenimiento[]> = this.subject.asObservable();

  constructor(private storage: StorageService) {}

  private load(): Mantenimiento[] {
    return this.storage.get<Mantenimiento[]>(KEY) || [];
  }

  private persist(list: Mantenimiento[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list);
  }

  getAll(): Mantenimiento[] {
    return this.subject.value;
  }

  reload(): void {
    this.subject.next(this.load());
  }

  create(data: Omit<Mantenimiento, 'id' | 'sincronizado'>): Mantenimiento {
    const item: Mantenimiento = { ...data, id: this.generateId(), sincronizado: false };
    this.persist([item, ...this.subject.value]);
    return item;
  }

  update(id: string, changes: Partial<Mantenimiento>): void {
    const list = this.subject.value.map((m) =>
      m.id === id ? { ...m, ...changes, sincronizado: false } : m
    );
    this.persist(list);
  }

  remove(id: string): void {
    this.persist(this.subject.value.filter((m) => m.id !== id));
  }

  cambiarEstado(id: string, estado: EstadoMantenimiento): void {
    this.update(id, { estado });
  }

  costoTotal(): number {
    return this.subject.value.reduce((s, m) => s + (m.costo || 0), 0);
  }

  private generateId(): string {
    return 'MT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  }
}
