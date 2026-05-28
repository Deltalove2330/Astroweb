// features/encuestador/medico-form-dialog.component.ts
//
// Diálogo grande para registrar un médico en la encuesta activa.
// Incluye buscador de médico existente (autocompletar) + formulario
// completo con datos del médico, dos consultorios y rangos económicos.

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, debounceTime, switchMap, of, catchError } from 'rxjs';
import { EncuestadorService, MedicoCatalogo, MedicoCentroPayload, Catalogos } from './encuestador.service';

@Component({
  selector: 'app-medico-form-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCheckboxModule,
  ],
  templateUrl: './medico-form-dialog.component.html',
  styleUrls: ['./medico-form-dialog.component.scss'],
})
export class MedicoFormDialogComponent implements OnInit {
  // Estado
  saving = signal(false);
  catalogos = signal<Catalogos | null>(null);

  // Buscador de médico existente
  searchQuery = '';
  searchResults = signal<MedicoCatalogo[]>([]);
  private searchTerm$ = new Subject<string>();

  // Form completo (modelo plano para [(ngModel)])
  form: Partial<MedicoCentroPayload> & {
    dias_consulta_arr?: string[];
    dias_consulta2_arr?: string[];
  } = {
    valor_consulta_rango: '',
    promedio_pacientes_semanal_rango: '',
    dias_consulta_arr: [],
    dias_consulta2_arr: [],
  };

  constructor(
    private svc: EncuestadorService,
    private dialogRef: MatDialogRef<MedicoFormDialogComponent>,
    private snack: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.svc.getCatalogos().subscribe(c => this.catalogos.set(c));

    this.searchTerm$.pipe(
      debounceTime(300),
      switchMap(q => (q.trim().length < 2)
        ? of({ success: true, medicos: [] })
        : this.svc.buscarMedicos(q).pipe(catchError(() => of({ success: false, medicos: [] }))))
    ).subscribe(r => this.searchResults.set(r.medicos || []));
  }

  onSearch(q: string): void {
    this.searchQuery = q;
    if (!q || q.trim().length < 2) {
      this.searchResults.set([]);
      return;
    }
    this.searchTerm$.next(q);
  }

  pickMedicoExistente(m: MedicoCatalogo): void {
    this.form = {
      ...this.form,
      id_medico: m.id_medico,
      id_medico_externo: m.id_medico_externo,
      apellido1: m.apellido1, apellido2: m.apellido2 ?? '',
      nombre1: m.nombre1,     nombre2: m.nombre2 ?? '',
      especialidad: m.especialidad,
      sub_especialidad: m.sub_especialidad ?? '',
      universidad_graduacion: m.universidad_graduacion ?? '',
      nro_MPPS: m.nro_MPPS ?? '', nro_colegiado: m.nro_colegiado ?? '',
      ciudad: m.ciudad, estado: m.estado,
      telefono: m.telefono ?? '', whatsapp: m.whatsapp ?? '',
      email: m.email ?? '', linkedin: m.linkedin ?? '', instagram: m.instagram ?? '',
    };
    this.searchQuery = `${m.apellido1}, ${m.nombre1}`;
    this.searchResults.set([]);
  }

  guardar(): void {
    // Validación mínima: rangos económicos siempre obligatorios
    if (!this.form.valor_consulta_rango || !this.form.promedio_pacientes_semanal_rango) {
      this.snack.open('Valor de consulta y promedio de pacientes son obligatorios', 'OK', { duration: 4000 });
      return;
    }
    // Si es médico nuevo (sin id_medico), los datos básicos del médico son requeridos
    if (!this.form.id_medico) {
      const req: (keyof MedicoCentroPayload)[] = ['id_medico_externo','apellido1','nombre1','especialidad','ciudad','estado'];
      for (const k of req) {
        if (!this.form[k]) {
          this.snack.open(`Campo obligatorio: ${k}`, 'OK', { duration: 4000 });
          return;
        }
      }
    }

    const payload: MedicoCentroPayload = {
      ...(this.form as MedicoCentroPayload),
      dias_consulta:  (this.form.dias_consulta_arr || []).join(','),
      dias_consulta2: (this.form.dias_consulta2_arr || []).join(','),
    };
    delete (payload as any).dias_consulta_arr;
    delete (payload as any).dias_consulta2_arr;

    this.saving.set(true);
    this.svc.guardarMedicoCentro(payload).subscribe({
      next: (r) => {
        this.saving.set(false);
        this.snack.open('Médico agregado correctamente', 'OK', { duration: 2500 });
        this.dialogRef.close({ ok: true, medicos_en_centro: r.medicos_en_centro });
      },
      error: (err) => {
        this.saving.set(false);
        const detail = err?.error?.detail || 'Error al guardar';
        this.snack.open(typeof detail === 'string' ? detail : 'Error al guardar', 'OK', { duration: 5000 });
      },
    });
  }

  cerrar(): void { this.dialogRef.close({ ok: false }); }
}
