import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Pedido, EstadoPedido, ItemPedido } from '../models/pedido.model';

const KEY = 'pedidos';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private subject = new BehaviorSubject<Pedido[]>(this.load().filter((p) => !p.eliminado));
  list$: Observable<Pedido[]> = this.subject.asObservable();

  constructor(private storage: StorageService) {}

  private now(): string { return new Date().toISOString(); }

  private load(): Pedido[] {
    return this.storage.get<Pedido[]>(KEY) || [];
  }

  private persist(list: Pedido[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list.filter((p) => !p.eliminado));
  }

  getAll(): Pedido[] {
    return this.subject.value;
  }

  getAllRaw(): Pedido[] {
    return this.load();
  }

  reload(): void {
    this.subject.next(this.load().filter((p) => !p.eliminado));
  }

  replaceAll(list: Pedido[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list.filter((p) => !p.eliminado));
  }

  getById(id: string): Pedido | undefined {
    return this.subject.value.find((p) => p.id === id) || this.load().find((p) => p.id === id);
  }

  create(data: Omit<Pedido, 'id' | 'numero' | 'sincronizado'>): Pedido {
    const pedido: Pedido = {
      ...data,
      id: this.generateId(),
      numero: this.nextNumero(),
      sincronizado: false,
      eliminado: false,
      updatedAt: this.now(),
    };
    this.persist([pedido, ...this.load()]);
    return pedido;
  }

  update(id: string, changes: Partial<Pedido>): void {
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

  cambiarEstado(id: string, estado: EstadoPedido): void {
    this.update(id, { estado });
  }

  totalPendiente(): number {
    return this.subject.value
      .filter((p) => p.estado !== 'entregado' && p.estado !== 'cancelado')
      .reduce((s, p) => s + p.total, 0);
  }

  calcularTotal(items: ItemPedido[]): number {
    return items.reduce((s, i) => s + i.subtotal, 0);
  }

  pendientesSync(): Pedido[] {
    return this.load().filter((p) => !p.sincronizado);
  }

  marcarSincronizados(ids: string[]): void {
    const set = new Set(ids);
    const list = this.load().map((p) => (set.has(p.id) ? { ...p, sincronizado: true } : p));
    this.persist(list);
  }

  private nextNumero(): string {
    const n = this.load().length + 1;
    return 'PED-' + String(n).padStart(4, '0');
  }

  private generateId(): string {
    const c: any = (globalThis as any).crypto;
    const uuid = c && typeof c.randomUUID === 'function' ? c.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    return 'PD-' + uuid;
  }
}
