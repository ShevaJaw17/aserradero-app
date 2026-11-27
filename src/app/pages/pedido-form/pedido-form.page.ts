import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoService } from '../../services/pedido.service';
import { ItemPedido, Pedido } from '../../models/pedido.model';

@Component({
  standalone: false,
  selector: 'app-pedido-form',
  templateUrl: './pedido-form.page.html',
  styleUrls: ['./pedido-form.page.scss'],
})
export class PedidoFormPage {
  id: string | null = null;
  form: FormGroup;
  items: ItemPedido[] = [];

  prodNombre = '';
  prodDim = '';
  prodCantidad: number | null = 1;
  prodPrecio: number | null = null;

  constructor(private fb: FormBuilder, private svc: PedidoService, private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      cliente: ['', Validators.required],
      telefono: [''],
      notas: [''],
      fecha: [new Date().toISOString()],
    });
    this.id = this.route.snapshot.queryParamMap.get('id');
    if (this.id) {
      const p = this.svc.getById(this.id);
      if (p) {
        this.form.patchValue({ cliente: p.cliente, telefono: p.telefono || '', notas: p.notas || '', fecha: p.fecha });
        this.items = [...p.items];
      }
    }
  }

  get total(): number {
    return this.items.reduce((s, i) => s + i.subtotal, 0);
  }

  agregarItem(): void {
    if (!this.prodNombre.trim() || !this.prodCantidad || this.prodCantidad <= 0 || this.prodPrecio === null || this.prodPrecio <= 0) return;
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
    if (this.form.invalid || this.items.length === 0) return;
    if (this.items.some((i) => i.cantidad <= 0 || i.precioUnitario <= 0)) return;
    const v = this.form.value;
    const data: Omit<Pedido, 'id' | 'numero' | 'sincronizado'> = {
      cliente: v.cliente,
      telefono: v.telefono,
      fecha: v.fecha,
      items: this.items,
      total: this.total,
      estado: 'pendiente',
      notas: v.notas,
    };
    if (this.id) this.svc.update(this.id, data);
    else this.svc.create(data);
    this.router.navigateByUrl('/pedidos');
  }
}
