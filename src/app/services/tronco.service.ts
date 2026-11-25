import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { SyncService } from './sync.service';
import { Tronco, EstadoTronco } from '../models/tronco.model';

const KEY = 'troncos';

@Injectable({ providedIn: 'root' })
export class TroncoService {
  private subject = new BehaviorSubject<Tronco[]>(this.load());
  list$: Observable<Tronco[]> = this.subject.asObservable();

  constructor(private storage: StorageService, private sync: SyncService) {}

  private load(): Tronco[] {
    return this.storage.get<Tronco[]>(KEY) || [];
  }

  private persist(list: Tronco[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list);
  }

  getAll(): Tronco[] {
    return this.subject.value;
  }

  reload(): void {
    this.subject.next(this.load());
  }

  getById(id: string): Tronco | undefined {
    return this.subject.value.find((t) => t.id === id);
  }

  create(data: Omit<Tronco, 'id' | 'sincronizado'>): Tronco {
    const tronco: Tronco = {
      ...data,
      id: this.generateId(),
      sincronizado: false,
    };
    this.persist([tronco, ...this.subject.value]);
    return tronco;
  }

  update(id: string, changes: Partial<Tronco>): void {
    const list = this.subject.value.map((t) =>
      t.id === id ? { ...t, ...changes, sincronizado: false } : t
    );
    this.persist(list);
  }

  remove(id: string): void {
    this.persist(this.subject.value.filter((t) => t.id !== id));
  }

  cambiarEstado(id: string, estado: EstadoTronco): void {
    this.update(id, { estado });
  }

  pendientesSync(): Tronco[] {
    return this.subject.value.filter((t) => !t.sincronizado);
  }

  marcarSincronizados(ids: string[]): void {
    const set = new Set(ids);
    this.persist(this.subject.value.map((t) => (set.has(t.id) ? { ...t, sincronizado: true } : t)));
  }

  volumenTotal(list: Tronco[] = this.subject.value): number {
    return list.reduce((s, t) => s + (t.volumenM3 || 0), 0);
  }

  private generateId(): string {
    return 'TR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  }
}
