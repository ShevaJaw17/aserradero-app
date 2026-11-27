import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacturaService } from '../../services/factura.service';
import { PedidoService } from '../../services/pedido.service';
import { ItemFactura, Factura } from '../../models/factura.model';

@Component({
  standalone: false,
  selector: 'app-factura-form',
  templateUrl: './factura-form.page.html',
  styleUrls: ['./factura-form.page.scss'],
})
export class FacturaFormPage implements OnInit {
  id: string | null = null;
  pedidoId: string | null = null;
  form: FormGroup;
  items: ItemFactura[] = [];

  desc = '';
  cant: number | null = 1;
  precio: number | null = null;

  constructor(
    private fb: FormBuilder,
    private svc: FacturaService,
    private pedidos: PedidoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      cliente: ['', Validators.required],
      impuestoPct: [13],
      metodoPago: [''],
      fecha: [new Date().toISOString()],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParamMap.get('id');
    this.pedidoId = this.route.snapshot.queryParamMap.get('pedidoId');
    if (this.id) {
      const f = this.svc.getAll().find((x) => x.id === this.id);
      if (f) {
        this.form.patchValue({
          cliente: f.cliente,
          impuestoPct: f.subtotal > 0 ? (f.impuesto / f.subtotal) * 100 : 0,
          metodoPago: f.metodoPago || '',
          fecha: f.fecha,
        });
        this.items = [...f.items];
        this.pedidoId = f.pedidoId || null;
      }
    } else if (this.pedidoId) {
      const p = this.pedidos.getById(this.pedidoId);
      if (p) {
        this.form.patchValue({ cliente: p.cliente });
        this.items = p.items.map((i) => ({
          descripcion: i.producto + (i.dimensiones ? ' ' + i.dimensiones : ''),
          cantidad: i.cantidad,
          precioUnitario: i.precioUnitario,
          subtotal: i.subtotal,
        }));
      }
    }
  }

  get totales() {
    return this.svc.calcularTotales(this.items, this.form.get('impuestoPct')?.value || 0);
  }

  agregarItem(): void {
    if (!this.desc.trim() || !this.cant || this.cant <= 0 || this.precio === null || this.precio <= 0) return;
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
    if (this.form.invalid || this.items.length === 0) return;
    if (this.items.some((i) => i.cantidad <= 0 || i.precioUnitario <= 0)) return;
    const v = this.form.value;
    const t = this.totales;
    const data: Omit<Factura, 'id' | 'numero' | 'sincronizado'> = {
      pedidoId: this.pedidoId || undefined,
      cliente: v.cliente,
      fecha: v.fecha,
      items: this.items,
      subtotal: t.subtotal,
      impuesto: t.impuesto,
      total: t.total,
      estado: 'pendiente',
      metodoPago: v.metodoPago,
    };
    if (this.id) this.svc.update(this.id, data);
    else this.svc.create(data);
    this.router.navigateByUrl('/facturacion');
  }
}
