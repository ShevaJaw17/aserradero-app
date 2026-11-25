import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Produccion, TipoProducto } from '../models/produccion.model';

const KEY = 'produccion';

@Injectable({ providedIn: 'root' })
export class ProduccionService {
  private subject = new BehaviorSubject<Produccion[]>(this.load());
  list$: Observable<Produccion[]> = this.subject.asObservable();

  constructor(private storage: StorageService) {}

  private load(): Produccion[] {
    return this.storage.get<Produccion[]>(KEY) || [];
  }

  private persist(list: Produccion[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list);
  }

  getAll(): Produccion[] {
    return this.subject.value;
  }

  reload(): void {
    this.subject.next(this.load());
  }

  create(data: Omit<Produccion, 'id' | 'sincronizado'>): Produccion {
    const item: Produccion = { ...data, id: this.generateId(), sincronizado: false };
    this.persist([item, ...this.subject.value]);
    return item;
  }

  update(id: string, changes: Partial<Produccion>): void {
    const list = this.subject.value.map((p) =>
      p.id === id ? { ...p, ...changes, sincronizado: false } : p
    );
    this.persist(list);
  }

  remove(id: string): void {
    this.persist(this.subject.value.filter((p) => p.id !== id));
  }

  volumenTotal(list: Produccion[] = this.subject.value): number {
    return list.reduce((s, p) => s + (p.volumenM3 || 0), 0);
  }

  porTipo(tipo: TipoProducto): Produccion[] {
    return this.subject.value.filter((p) => p.tipo === tipo);
  }

  private generateId(): string {
    return 'PR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  }
}
