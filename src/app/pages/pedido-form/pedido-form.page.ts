import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { ItemPedido } from '../../models/pedido.model';

@Component({
  standalone: false,
  selector: 'app-pedido-form',
  templateUrl: './pedido-form.page.html',
  styleUrls: ['./pedido-form.page.scss'],
})
export class PedidoFormPage {
  id: string | null = null;
  cliente = '';
  telefono = '';
  notas = '';
  fecha = new Date().toISOString();
  items: ItemPedido[] = [];

  // item editor
  prodNombre = '';
  prodDim = '';
  prodCantidad: number | null = 1;
  prodPrecio: number | null = null;

  constructor(private svc: PedidoService, private router: Router, private route: ActivatedRoute) {
    this.id = this.route.snapshot.queryParamMap.get('id');
    if (this.id) {
      const p = this.svc.getById(this.id);
      if (p) {
        this.cliente = p.cliente; this.telefono = p.telefono || '';
        this.notas = p.notas || ''; this.fecha = p.fecha;
        this.items = [...p.items];
      }
    }
  }

  get total(): number {
    return this.svc.calcularTotal(this.items);
  }

  agregarItem(): void {
    if (!this.prodNombre || !this.prodCantidad || this.prodPrecio === null) return;
    const sub = this.prodCantidad * this.prodPrecio;
    this.items.push({
      producto: this.prodNombre,
      dimensiones: this.prodDim,
      cantidad: this.prodCantidad,
      precioUnitario: this.prodPrecio,
      subtotal: sub,
    });
    this.prodNombre = '';
    this.prodDim = '';
    this.prodCantidad = 1;
    this.prodPrecio = null;
  }

  quitarItem(i: number): void {
    this.items.splice(i, 1);
  }

  guardar(): void {
    if (!this.cliente || this.items.length === 0) return;
    const data: any = {
      cliente: this.cliente,
      telefono: this.telefono,
      fecha: this.fecha,
      items: this.items,
      total: this.total,
      estado: 'pendiente',
      notas: this.notas,
    };
    if (this.id) this.svc.update(this.id, data);
    else this.svc.create(data as any);
    this.router.navigateByUrl('/pedidos');
  }
}
