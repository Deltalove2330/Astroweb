// features/encuestador/nuevo-centro-dialog.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EncuestadorService, CentroCreatePayload, Centro, Catalogos } from './encuestador.service';

@Component({
  selector: 'app-nuevo-centro-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,
  ],
  template: `
    <div mat-dialog-title>
      <mat-icon>add_circle</mat-icon> Nuevo centro de salud
    </div>
    <div mat-dialog-content class="ncd-content">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Nombre del centro *</mat-label>
        <input matInput [(ngModel)]="form.nombre_centro" required>
      </mat-form-field>
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Dirección completa *</mat-label>
        <textarea matInput rows="2" [(ngModel)]="form.direccion_completa" required></textarea>
      </mat-form-field>
      <div class="ncd-row">
        <mat-form-field appearance="outline">
          <mat-label>Ciudad</mat-label>
          <input matInput [(ngModel)]="form.ciudad">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <input matInput [(ngModel)]="form.estado">
        </mat-form-field>
      </div>
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Fuente de información</mat-label>
        <mat-select [(ngModel)]="fuenteInformacion">
          @for (f of catalogos()?.fuentes_informacion || []; track f) {
            <mat-option [value]="f">{{ f }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()" [disabled]="saving()">Cancelar</button>
      <button mat-flat-button color="primary" (click)="guardar()" [disabled]="saving()">
        <mat-icon>check</mat-icon> Crear y abrir encuesta
      </button>
    </div>
  `,
  styles: [`
    :host { display: block; }
    [mat-dialog-title] { display: flex; align-items: center; gap: .5rem; mat-icon { color: #6d28d9; }}
    .ncd-content { min-width: min(480px, 90vw); }
    .w-full { width: 100%; }
    .ncd-row { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; }
  `],
})
export class NuevoCentroDialogComponent implements OnInit {
  form: CentroCreatePayload = { nombre_centro: '', direccion_completa: '' };
  fuenteInformacion = '';
  saving = signal(false);
  catalogos = signal<Catalogos | null>(null);

  constructor(
    private svc: EncuestadorService,
    private dialogRef: MatDialogRef<NuevoCentroDialogComponent, { centro: Centro; fuente: string } | null>,
    private snack: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.svc.getCatalogos().subscribe(c => {
      this.catalogos.set(c);
      this.fuenteInformacion = c.fuentes_informacion[0] || 'Visita presencial';
    });
  }

  guardar(): void {
    if (!this.form.nombre_centro?.trim() || !this.form.direccion_completa?.trim()) {
      this.snack.open('Nombre y dirección son obligatorios', 'OK', { duration: 4000 });
      return;
    }
    this.saving.set(true);
    this.svc.crearCentro(this.form).subscribe({
      next: (r) => {
        this.saving.set(false);
        this.dialogRef.close({
          centro: {
            id_centro: r.id_centro, nombre_centro: r.nombre_centro,
            ciudad: r.ciudad, estado: r.estado, direccion_completa: r.direccion_completa,
          },
          fuente: this.fuenteInformacion,
        });
      },
      error: (err) => {
        this.saving.set(false);
        const detail = err?.error?.detail || 'Error al crear el centro';
        this.snack.open(typeof detail === 'string' ? detail : 'Error al crear el centro', 'OK', { duration: 5000 });
      },
    });
  }

  cancelar(): void { this.dialogRef.close(null); }
}
