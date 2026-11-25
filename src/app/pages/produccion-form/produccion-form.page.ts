import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProduccionService } from '../../services/produccion.service';
import { AuthService } from '../../services/auth.service';
import { Produccion, TipoProducto } from '../../models/produccion.model';

@Component({
  standalone: false,
  selector: 'app-produccion-form',
  templateUrl: './produccion-form.page.html',
  styleUrls: ['./produccion-form.page.scss'],
})
export class ProduccionFormPage implements OnInit {
  id: string | null = null;
  tipo: TipoProducto = 'tabla';
  especie = '';
  espesorCm: number | null = null;
  anchoCm: number | null = null;
  largoM: number | null = null;
  cantidad: number | null = 1;
  volumenM3: number | null = null;
  operador = '';
  turno = '';
  fecha = new Date().toISOString();
  troncoId = '';

  constructor(
    private svc: ProduccionService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.operador = this.auth.currentUser?.nombre || '';
    this.id = this.route.snapshot.queryParamMap.get('id');
    if (this.id) {
      const p = this.svc.getAll().find((x) => x.id === this.id);
      if (p) {
        this.tipo = p.tipo; this.especie = p.especie; this.espesorCm = p.espesorCm;
        this.anchoCm = p.anchoCm; this.largoM = p.largoM; this.cantidad = p.cantidad;
        this.volumenM3 = p.volumenM3; this.operador = p.operador; this.turno = p.turno || '';
        this.fecha = p.fecha; this.troncoId = p.troncoId || '';
      }
    }
  }

  calcularVolumen(): void {
    if (this.espesorCm && this.anchoCm && this.largoM && this.cantidad) {
      const v = (this.espesorCm / 100) * (this.anchoCm / 100) * this.largoM * this.cantidad;
      this.volumenM3 = Math.round(v * 1000) / 1000;
    }
  }

  guardar(): void {
    if (!this.especie || !this.espesorCm || !this.anchoCm || !this.largoM || !this.cantidad) return;
    const data = {
      fecha: this.fecha,
      troncoId: this.troncoId || undefined,
      tipo: this.tipo,
      especie: this.especie,
      espesorCm: this.espesorCm,
      anchoCm: this.anchoCm,
      largoM: this.largoM,
      cantidad: this.cantidad,
      volumenM3: this.volumenM3 || 0,
      operador: this.operador,
      turno: this.turno,
    };
    if (this.id) this.svc.update(this.id, data);
    else this.svc.create(data);
    this.router.navigateByUrl('/produccion');
  }
}
