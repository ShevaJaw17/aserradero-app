import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TroncoService } from '../../services/tronco.service';
import { Tronco, EstadoTronco } from '../../models/tronco.model';

@Component({
  standalone: false,
  selector: 'app-tronco-form',
  templateUrl: './tronco-form.page.html',
  styleUrls: ['./tronco-form.page.scss'],
})
export class TroncoFormPage implements OnInit {
  id: string | null = null;
  especie = '';
  diametroCm: number | null = null;
  longitudM: number | null = null;
  volumenM3: number | null = null;
  proveedor = '';
  ubicacion = '';
  estado: EstadoTronco = 'en_patio';
  notas = '';
  fechaIngreso = new Date().toISOString();

  constructor(
    private svc: TroncoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || this.route.snapshot.queryParamMap.get('id');
    if (this.id) {
      const t = this.svc.getById(this.id);
      if (t) {
        this.especie = t.especie;
        this.diametroCm = t.diametroCm;
        this.longitudM = t.longitudM;
        this.volumenM3 = t.volumenM3;
        this.proveedor = t.proveedor || '';
        this.ubicacion = t.ubicacion || '';
        this.estado = t.estado;
        this.notas = t.notas || '';
        this.fechaIngreso = t.fechaIngreso;
      }
    }
  }

  calcularVolumen(): void {
    if (this.diametroCm && this.longitudM) {
      const r = this.diametroCm / 2 / 100;
      this.volumenM3 = Math.round(Math.PI * r * r * this.longitudM * 1000) / 1000;
    }
  }

  guardar(): void {
    if (!this.especie || !this.diametroCm || !this.longitudM) return;
    const vol = this.volumenM3 || 0;
    const data = {
      fechaIngreso: this.fechaIngreso,
      especie: this.especie,
      diametroCm: this.diametroCm,
      longitudM: this.longitudM,
      volumenM3: vol,
      proveedor: this.proveedor,
      ubicacion: this.ubicacion,
      estado: this.estado,
      notas: this.notas,
    };
    if (this.id) {
      this.svc.update(this.id, data);
    } else {
      this.svc.create(data);
    }
    this.router.navigateByUrl('/troncos');
  }
}
