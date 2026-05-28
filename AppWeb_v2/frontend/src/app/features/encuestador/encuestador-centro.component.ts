// features/encuestador/encuestador-centro.component.ts
//
// Pantalla principal del encuestador:
//   STEP 1: si no hay encuesta abierta → buscar/crear centro
//   STEP 2: si hay encuesta abierta → mostrar centro actual + médicos
//            registrados + botón "Agregar médico"

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, debounceTime, switchMap, of, catchError } from 'rxjs';
import {
  EncuestadorService, Centro, EncuestaAbiertaResponse, MedicoEnEncuesta, Catalogos
} from './encuestador.service';
import { NuevoCentroDialogComponent } from './nuevo-centro-dialog.component';
import { MedicoFormDialogComponent } from './medico-form-dialog.component';

@Component({
  selector: 'app-encuestador-centro',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatCardModule, MatProgressSpinnerModule, MatChipsModule,
  ],
  templateUrl: './encuestador-centro.component.html',
  styleUrls: ['./encuestador-centro.component.scss'],
})
export class EncuestadorCentroComponent implements OnInit {
  // Estado
  loading = signal(true);
  busy = signal(false);
  encuesta = signal<EncuestaAbiertaResponse | null>(null);
  catalogos = signal<Catalogos | null>(null);

  // Búsqueda de centro
  centroSearch = '';
  centros = signal<Centro[]>([]);
  private centroSearch$ = new Subject<string>();

  // Computed-like getters
  get tieneEncuesta(): boolean { return !!this.encuesta()?.tiene_encuesta; }
  get jornadaActiva(): boolean { return !!this.encuesta()?.jornada_activa; }
  get medicos(): MedicoEnEncuesta[] { return this.encuesta()?.medicos || []; }

  constructor(
    private svc: EncuestadorService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.svc.getCatalogos().subscribe(c => this.catalogos.set(c));

    // Auto-cargar primeros 100 centros al entrar (vista inicial)
    this.centroSearch$.pipe(
      debounceTime(250),
      switchMap(q => this.svc.buscarCentros(q).pipe(catchError(() => of({ success: false, centros: [] }))))
    ).subscribe(r => this.centros.set(r.centros || []));

    this.loadEncuesta();
  }

  loadEncuesta(): void {
    this.loading.set(true);
    this.svc.getEncuestaAbierta().subscribe({
      next: (r) => {
        this.encuesta.set(r);
        this.loading.set(false);
        if (!r.jornada_activa) {
          this.snack.open('Debes activar la jornada primero', 'OK', { duration: 3000 });
          this.router.navigateByUrl('/encuestador');
          return;
        }
        if (!r.tiene_encuesta) {
          // Cargar lista inicial de centros
          this.centroSearch$.next('');
        }
      },
      error: () => {
        this.loading.set(false);
        this.snack.open('Error al cargar la encuesta', 'OK', { duration: 4000 });
      },
    });
  }

  onCentroSearch(q: string): void {
    this.centroSearch = q;
    this.centroSearch$.next(q);
  }

  iniciarEncuestaConCentro(centro: Centro): void {
    if (!confirm(`¿Iniciar encuesta en "${centro.nombre_centro}"?`)) return;
    this.busy.set(true);
    this.svc.crearEncuesta({
      id_centro: centro.id_centro,
      fuente_informacion: this.catalogos()?.fuentes_informacion[0] || 'Visita presencial',
    }).subscribe({
      next: () => { this.busy.set(false); this.loadEncuesta(); },
      error: (err) => {
        this.busy.set(false);
        const detail = err?.error?.detail;
        const msg = (detail && typeof detail === 'object') ? detail.message :
                    (typeof detail === 'string' ? detail : 'Error al abrir el centro');
        this.snack.open(msg, 'OK', { duration: 5000 });
      },
    });
  }

  abrirNuevoCentroDialog(): void {
    const ref = this.dialog.open(NuevoCentroDialogComponent, { autoFocus: 'first-tabbable' });
    ref.afterClosed().subscribe(res => {
      if (res?.centro) this.iniciarEncuestaConCentro(res.centro);
    });
  }

  abrirAgregarMedico(): void {
    const ref = this.dialog.open(MedicoFormDialogComponent, {
      autoFocus: 'first-tabbable', panelClass: 'mfd-panel',
    });
    ref.afterClosed().subscribe(res => {
      if (res?.ok) this.loadEncuesta();
    });
  }

  cerrarEncuesta(): void {
    const idEnc = this.encuesta()?.id_encuesta;
    if (!idEnc) return;
    if (!confirm('¿Cerrar el centro? Podrás abrir otro a continuación.')) return;
    this.busy.set(true);
    this.svc.cerrarEncuesta(idEnc).subscribe({
      next: () => { this.busy.set(false); this.loadEncuesta(); },
      error: () => { this.busy.set(false); this.snack.open('Error al cerrar', 'OK', { duration: 4000 }); },
    });
  }
}
