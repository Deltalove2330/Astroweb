// features/encuestador/encuestador-dashboard.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EncuestadorService, JornadaActivaResponse, ActivarJornadaPayload } from './encuestador.service';

@Component({
  selector: 'app-encuestador-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule, MatProgressSpinnerModule,
  ],
  templateUrl: './encuestador-dashboard.component.html',
  styleUrls: ['./encuestador-dashboard.component.scss'],
})
export class EncuestadorDashboardComponent implements OnInit {
  loading = signal(true);
  jornada = signal<JornadaActivaResponse | null>(null);
  busy = signal(false);

  constructor(
    private svc: EncuestadorService,
    private snack: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.svc.getJornadaActiva().subscribe({
      next: (r) => { this.jornada.set(r); this.loading.set(false); },
      error: () => { this.loading.set(false); this.snack.open('Error al cargar la jornada', 'OK', { duration: 4000 }); },
    });
  }

  activar(): void {
    this.busy.set(true);
    const tryActivate = (payload: ActivarJornadaPayload) => {
      this.svc.activarJornada(payload).subscribe({
        next: (r) => {
          this.busy.set(false);
          if (r.success) {
            this.router.navigateByUrl('/encuestador/centro');
          } else {
            this.snack.open('No se pudo activar la jornada', 'OK', { duration: 4000 });
          }
        },
        error: () => {
          this.busy.set(false);
          this.snack.open('Error al activar la jornada', 'OK', { duration: 4000 });
        },
      });
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => tryActivate({ latitud: pos.coords.latitude, longitud: pos.coords.longitude }),
        () => tryActivate({}),
        { timeout: 5000 },
      );
    } else {
      tryActivate({});
    }
  }

  finalizar(): void {
    if (!confirm('¿Finalizar la jornada actual? No podrás registrar más médicos hasta abrir otra.')) return;
    this.busy.set(true);
    this.svc.finalizarJornada().subscribe({
      next: () => {
        this.busy.set(false);
        this.snack.open('Jornada finalizada', 'OK', { duration: 3000 });
        this.load();
      },
      error: () => {
        this.busy.set(false);
        this.snack.open('Error al finalizar la jornada', 'OK', { duration: 4000 });
      },
    });
  }
}
