import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Factura, EstadoFactura, ItemFactura } from '../models/factura.model';

const KEY = 'facturas';

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private subject = new BehaviorSubject<Factura[]>(this.load().filter((f) => !f.eliminado));
  list$: Observable<Factura[]> = this.subject.asObservable();

  constructor(private storage: StorageService) {}

  private now(): string { return new Date().toISOString(); }

  private load(): Factura[] {
    return this.storage.get<Factura[]>(KEY) || [];
  }

  private persist(list: Factura[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list.filter((f) => !f.eliminado));
  }

  getAll(): Factura[] {
    return this.subject.value;
  }

  getAllRaw(): Factura[] {
    return this.load();
  }

  reload(): void {
    this.subject.next(this.load().filter((f) => !f.eliminado));
  }

  replaceAll(list: Factura[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list.filter((f) => !f.eliminado));
  }

  create(data: Omit<Factura, 'id' | 'numero' | 'sincronizado'>): Factura {
    const factura: Factura = {
      ...data,
      id: this.generateId(),
      numero: this.nextNumero(),
      sincronizado: false,
      eliminado: false,
      updatedAt: this.now(),
    };
    this.persist([factura, ...this.load()]);
    return factura;
  }

  update(id: string, changes: Partial<Factura>): void {
    const list = this.load().map((f) =>
      f.id === id ? { ...f, ...changes, sincronizado: false, updatedAt: this.now() } : f
    );
    this.persist(list);
  }

  remove(id: string): void {
    const list = this.load().map((f) =>
      f.id === id ? { ...f, eliminado: true, sincronizado: false, updatedAt: this.now() } : f
    );
    this.persist(list);
  }

  cambiarEstado(id: string, estado: EstadoFactura): void {
    this.update(id, { estado });
  }

  totalFacturado(): number {
    return this.subject.value
      .filter((f) => f.estado !== 'anulada')
      .reduce((s, f) => s + f.total, 0);
  }

  calcularTotales(items: ItemFactura[], impuestoPct: number = 0): { subtotal: number; impuesto: number; total: number } {
    const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
    const impuesto = subtotal * (impuestoPct / 100);
    return { subtotal, impuesto, total: subtotal + impuesto };
  }

  pendientesSync(): Factura[] {
    return this.load().filter((f) => !f.sincronizado);
  }

  marcarSincronizados(ids: string[]): void {
    const set = new Set(ids);
    const list = this.load().map((f) => (set.has(f.id) ? { ...f, sincronizado: true } : f));
    this.persist(list);
  }

  private nextNumero(): string {
    const n = this.load().length + 1;
    return 'FAC-' + String(n).padStart(4, '0');
  }

  private generateId(): string {
    const c: any = (globalThis as any).crypto;
    const uuid = c && typeof c.randomUUID === 'function' ? c.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    return 'FC-' + uuid;
  }
}
