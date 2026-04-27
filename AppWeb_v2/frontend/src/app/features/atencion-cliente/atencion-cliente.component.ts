import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-atencion-cliente',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule,
  ],
  templateUrl: './atencion-cliente.component.html',
  styleUrls: ['./atencion-cliente.component.scss']
})
export class AtencionClienteComponent implements OnInit {
  loadingSolicitudes = signal(true);
  solicitudes = signal<any[]>([]);
  today = new Date();

  constructor(private api: ApiService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.api.getSolicitudes('pendiente').subscribe({
      next: (data) => { this.solicitudes.set(data); this.loadingSolicitudes.set(false); },
      error: () => this.loadingSolicitudes.set(false)
    });
  }

  aprobar(id: number): void {
    this.api.aprobarSolicitud(id).subscribe({
      next: () => {
        this.solicitudes.update(ss => ss.map(s => s.id === id ? { ...s, estado: 'aprobada' } : s));
        this.snack.open('Solicitud aprobada', 'OK', { duration: 2000 });
      }
    });
  }

  rechazar(id: number): void {
    this.api.rechazarSolicitud(id).subscribe({
      next: () => {
        this.solicitudes.update(ss => ss.map(s => s.id === id ? { ...s, estado: 'rechazada' } : s));
        this.snack.open('Solicitud rechazada', 'OK', { duration: 2000 });
      }
    });
  }

  getSolicitudClasses(estado: string): string {
    const map: Record<string, string> = {
      aprobada: 'bg-emerald-100 text-emerald-700',
      rechazada: 'bg-rose-100 text-rose-700',
      pendiente: 'bg-amber-100 text-amber-700'
    };
    return map[estado] ?? 'bg-slate-100 text-slate-500';
  }
}
