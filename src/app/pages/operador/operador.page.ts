import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OperadorService } from '../../services/operador.service';
import { TrabajoOperador, Maquina } from '../../models/operador.model';

@Component({
  standalone: false,
  selector: 'app-operador',
  templateUrl: './operador.page.html',
  styleUrls: ['./operador.page.scss'],
})
export class OperadorPage {
  form: FormGroup;
  trabajos: TrabajoOperador[] = [];

  constructor(private fb: FormBuilder, private svc: OperadorService, private route: ActivatedRoute) {
    const m = (this.route.snapshot.data['maquina'] as Maquina) || 'despuntador';
    this.form = this.fb.group({
      maquina: [m, Validators.required],
      cantidadReglas: [1, [Validators.required, Validators.min(1)]],
      largo: [0],
      ancho: [0],
      grosor: [0],
      tipoTarima: ['', Validators.required],
      dimensiones: [''],
    });
    this.svc.list$.subscribe((l) => (this.trabajos = l));
  }

  guardar(): void {
    const v = this.form.value;
    if (v.maquina === 'mesa_tacos') {
      if (!v.dimensiones || !v.cantidadReglas || v.cantidadReglas <= 0 || !v.tipoTarima) return;
    } else {
      if (!v.largo || v.largo <= 0 || !v.ancho || v.ancho <= 0 || !v.grosor || v.grosor <= 0 || !v.cantidadReglas || v.cantidadReglas <= 0 || !v.tipoTarima) return;
    }
    if (this.form.invalid) return;
    this.svc.create({
      maquina: v.maquina,
      fecha: new Date().toISOString(),
      cantidadReglas: v.cantidadReglas,
      largo: v.largo,
      ancho: v.ancho,
      grosor: v.grosor,
      tipoTarima: v.tipoTarima,
      bicelado: v.maquina === 'bicelador',
      dimensiones: v.dimensiones,
    });
    this.form.reset({ maquina: v.maquina, cantidadReglas: 1, largo: 0, ancho: 0, grosor: 0, tipoTarima: '', dimensiones: '' });
  }
}
