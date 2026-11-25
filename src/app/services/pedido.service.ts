import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Pedido, EstadoPedido, ItemPedido } from '../models/pedido.model';

const KEY = 'pedidos';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private subject = new BehaviorSubject<Pedido[]>(this.load());
  list$: Observable<Pedido[]> = this.subject.asObservable();

  constructor(private storage: StorageService) {}

  private load(): Pedido[] {
    return this.storage.get<Pedido[]>(KEY) || [];
  }

  private persist(list: Pedido[]): void {
    this.storage.set(KEY, list);
    this.subject.next(list);
  }

  getAll(): Pedido[] {
    return this.subject.value;
  }

  getById(id: string): Pedido | undefined {
    return this.subject.value.find((p) => p.id === id);
  }

  create(data: Omit<Pedido, 'id' | 'numero' | 'sincronizado'>): Pedido {
    const pedido: Pedido = {
      ...data,
      id: this.generateId(),
      numero: this.nextNumero(),
      sincronizado: false,
    };
    this.persist([pedido, ...this.subject.value]);
    return pedido;
  }

  update(id: string, changes: Partial<Pedido>): void {
    const list = this.subject.value.map((p) =>
      p.id === id ? { ...p, ...changes, sincronizado: false } : p
    );
    this.persist(list);
  }

  remove(id: string): void {
    this.persist(this.subject.value.filter((p) => p.id !== id));
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

  private nextNumero(): string {
    const n = this.subject.value.length + 1;
    return 'PED-' + String(n).padStart(4, '0');
  }

  private generateId(): string {
    return 'PD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  }
}
