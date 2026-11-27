import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private svc: ProduccionService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      tipo: ['tabla' as TipoProducto, Validators.required],
      especie: ['', Validators.required],
      espesorCm: [null, [Validators.required, Validators.min(0.001)]],
      anchoCm: [null, [Validators.required, Validators.min(0.001)]],
      largoM: [null, [Validators.required, Validators.min(0.001)]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      volumenM3: [null],
      operador: [''],
      turno: [''],
      fecha: [new Date().toISOString()],
      troncoId: [''],
    });
  }

  ngOnInit(): void {
    this.form.patchValue({ operador: this.auth.currentUser?.nombre || '' });
    this.id = this.route.snapshot.queryParamMap.get('id');
    if (this.id) {
      const p = this.svc.getAll().find((x) => x.id === this.id);
      if (p) {
        this.form.patchValue({
          tipo: p.tipo,
          especie: p.especie,
          espesorCm: p.espesorCm,
          anchoCm: p.anchoCm,
          largoM: p.largoM,
          cantidad: p.cantidad,
          volumenM3: p.volumenM3,
          operador: p.operador,
          turno: p.turno || '',
          fecha: p.fecha,
          troncoId: p.troncoId || '',
        });
      }
    }
    ['espesorCm', 'anchoCm', 'largoM', 'cantidad'].forEach((c) =>
      this.form.get(c)?.valueChanges.subscribe(() => this.calcularVolumen())
    );
  }

  calcularVolumen(): void {
    const v = this.form.value;
    if (v.espesorCm && v.anchoCm && v.largoM && v.cantidad) {
      const vol = (v.espesorCm / 100) * (v.anchoCm / 100) * v.largoM * v.cantidad;
      this.form.get('volumenM3')?.setValue(Math.round(vol * 1000) / 1000, { emitEvent: false });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const data: Omit<Produccion, 'id' | 'sincronizado'> = {
      fecha: v.fecha,
      troncoId: v.troncoId || undefined,
      tipo: v.tipo,
      especie: v.especie,
      espesorCm: v.espesorCm,
      anchoCm: v.anchoCm,
      largoM: v.largoM,
      cantidad: v.cantidad,
      volumenM3: v.volumenM3 || 0,
      operador: v.operador,
      turno: v.turno,
    };
    if (this.id) this.svc.update(this.id, data);
    else this.svc.create(data);
    this.router.navigateByUrl('/produccion');
  }
}
