import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mercaderista',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatListModule, MatStepperModule, MatSnackBarModule,
  ],
  templateUrl: './mercaderista.component.html',
  styleUrls: ['./mercaderista.component.scss']
})
export class MercaderistaComponent implements OnInit {
  rutas = signal<any[]>([]);
  loadingRoutes = signal(true);
  selectedRoute = signal<any>(null);
  activePoints = signal(0);
  totalPoints = signal(0);
  today = new Date().toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long' });

  constructor(private api: ApiService, private auth: AuthService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.api.getMercaderistaRoutes(user.id).subscribe({
        next: (data) => { 
          this.rutas.set(data); 
          this.loadingRoutes.set(false); 
          this.totalPoints.set(data.length * 5); 
        },
        error: () => { 
          this.loadingRoutes.set(false); 
        },
      });
    } else {
      this.loadingRoutes.set(false);
    }
  }

  startRoute(ruta: any): void {
    this.selectedRoute.set(ruta);
    this.snack.open(`Ruta "${ruta.nombre}" seleccionada`, 'OK', { duration: 2000 });
  }
}
