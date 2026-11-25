import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacturaService } from '../../services/factura.service';
import { PedidoService } from '../../services/pedido.service';
import { ItemFactura } from '../../models/factura.model';

@Component({
  standalone: false,
  selector: 'app-factura-form',
  templateUrl: './factura-form.page.html',
  styleUrls: ['./factura-form.page.scss'],
})
export class FacturaFormPage implements OnInit {
  id: string | null = null;
  pedidoId: string | null = null;
  cliente = '';
  impuestoPct = 13;
  metodoPago = '';
  fecha = new Date().toISOString();
  items: ItemFactura[] = [];

  // item editor
  desc = '';
  cant: number | null = 1;
  precio: number | null = null;

  constructor(
    private svc: FacturaService,
    private pedidos: PedidoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.queryParamMap.get('id');
    this.pedidoId = this.route.snapshot.queryParamMap.get('pedidoId');
    if (this.id) {
      const f = this.svc.getAll().find((x) => x.id === this.id);
      if (f) {
        this.cliente = f.cliente; this.impuestoPct = f.impuesto > 0 ? (f.impuesto / f.subtotal) * 100 : 0;
        this.metodoPago = f.metodoPago || ''; this.fecha = f.fecha; this.items = [...f.items];
        this.pedidoId = f.pedidoId || null;
      }
    } else if (this.pedidoId) {
      const p = this.pedidos.getById(this.pedidoId);
      if (p) {
        this.cliente = p.cliente;
        this.items = p.items.map((i) => ({
          descripcion: i.producto + (i.dimensiones ? ' ' + i.dimensiones : ''),
          cantidad: i.cantidad,
          precioUnitario: i.precioUnitario,
          subtotal: i.subtotal,
        }));
      }
    }
  }

  ngOnInit(): void {}

  get totales() {
    return this.svc.calcularTotales(this.items, this.impuestoPct);
  }

  agregarItem(): void {
    if (!this.desc || !this.cant || this.precio === null) return;
    this.items.push({
      descripcion: this.desc,
      cantidad: this.cant,
      precioUnitario: this.precio,
      subtotal: this.cant * this.precio,
    });
    this.desc = '';
    this.cant = 1;
    this.precio = null;
  }

  quitarItem(i: number): void {
    this.items.splice(i, 1);
  }

  guardar(): void {
    if (!this.cliente || this.items.length === 0) return;
    const t = this.totales;
    const data: any = {
      pedidoId: this.pedidoId || undefined,
      cliente: this.cliente,
      fecha: this.fecha,
      items: this.items,
      subtotal: t.subtotal,
      impuesto: t.impuesto,
      total: t.total,
      estado: 'pendiente',
      metodoPago: this.metodoPago,
    };
    if (this.id) this.svc.update(this.id, data);
    else this.svc.create(data as any);
    this.router.navigateByUrl('/facturacion');
  }
}
