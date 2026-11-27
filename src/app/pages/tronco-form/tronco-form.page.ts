import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private svc: TroncoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      especie: ['', Validators.required],
      diametroCm: [null, [Validators.required, Validators.min(0.001)]],
      longitudM: [null, [Validators.required, Validators.min(0.001)]],
      volumenM3: [null],
      proveedor: [''],
      ubicacion: [''],
      estado: ['en_patio' as EstadoTronco, Validators.required],
      notas: [''],
      fechaIngreso: [new Date().toISOString()],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || this.route.snapshot.queryParamMap.get('id');
    if (this.id) {
      const t = this.svc.getById(this.id);
      if (t) {
        this.form.patchValue({
          especie: t.especie,
          diametroCm: t.diametroCm,
          longitudM: t.longitudM,
          volumenM3: t.volumenM3,
          proveedor: t.proveedor || '',
          ubicacion: t.ubicacion || '',
          estado: t.estado,
          notas: t.notas || '',
          fechaIngreso: t.fechaIngreso,
        });
      }
    }
    this.form.get('diametroCm')?.valueChanges.subscribe(() => this.calcularVolumen());
    this.form.get('longitudM')?.valueChanges.subscribe(() => this.calcularVolumen());
  }

  calcularVolumen(): void {
    const d = this.form.get('diametroCm')?.value;
    const l = this.form.get('longitudM')?.value;
    if (d && l) {
      const r = d / 2 / 100;
      const v = Math.round(Math.PI * r * r * l * 1000) / 1000;
      this.form.get('volumenM3')?.setValue(v, { emitEvent: false });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const data: Omit<Tronco, 'id' | 'sincronizado'> = {
      fechaIngreso: v.fechaIngreso,
      especie: v.especie,
      diametroCm: v.diametroCm,
      longitudM: v.longitudM,
      volumenM3: v.volumenM3 || 0,
      proveedor: v.proveedor,
      ubicacion: v.ubicacion,
      estado: v.estado,
      notas: v.notas,
    };
    if (this.id) {
      this.svc.update(this.id, data);
    } else {
      this.svc.create(data);
    }
    this.router.navigateByUrl('/troncos');
  }
}
