import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Factura, EstadoFactura, ItemFactura } from '../models/factura.model';

const KEY = 'facturas';

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private subject = new BehaviorSubject<Factura[]>(this.load());
  list$: Observable<Factura[]> = this.subject.asObservable();

  constructor(private storage: StorageService) {}

  private load(): Factura[] {
    return this.storage.get<Factura[]>(KEY) || [];
  }

  private persist(list: Factura[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list);
  }

  getAll(): Factura[] {
    return this.subject.value;
  }

  reload(): void {
    this.subject.next(this.load());
  }

  create(data: Omit<Factura, 'id' | 'numero' | 'sincronizado'>): Factura {
    const factura: Factura = {
      ...data,
      id: this.generateId(),
      numero: this.nextNumero(),
      sincronizado: false,
    };
    this.persist([factura, ...this.subject.value]);
    return factura;
  }

  update(id: string, changes: Partial<Factura>): void {
    const list = this.subject.value.map((f) =>
      f.id === id ? { ...f, ...changes, sincronizado: false } : f
    );
    this.persist(list);
  }

  remove(id: string): void {
    this.persist(this.subject.value.filter((f) => f.id !== id));
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

  private nextNumero(): string {
    const n = this.subject.value.length + 1;
    return 'FAC-' + String(n).padStart(4, '0');
  }

  private generateId(): string {
    return 'FC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  }
}
