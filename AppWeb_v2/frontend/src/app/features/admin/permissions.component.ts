import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { User, Permission } from '../../core/models/user.model';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatTableModule, MatSelectModule, MatCheckboxModule,
    MatSnackBarModule
  ],
  template: `
    <div class="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Control de Accesos</h1>
          <p class="text-slate-500 dark:text-slate-400 font-medium">Gestione permisos granulares por usuario y módulo</p>
        </div>
        
        <div class="flex items-center gap-4">
          <mat-form-field appearance="outline" class="min-w-[300px]">
            <mat-label>Seleccionar Usuario</mat-label>
            <mat-select [(ngModel)]="selectedUserId" (selectionChange)="onUserChange($event.value)">
              <mat-option *ngFor="let u of users()" [value]="u.id">
                {{ u.username }} ({{ u.rol }})
              </mat-option>
            </mat-select>
          </mat-form-field>
          
          <button mat-flat-button color="primary" 
                  [disabled]="!selectedUserId || saving()" 
                  (click)="savePermissions()"
                  class="!rounded-2xl !h-14 px-8 shadow-xl shadow-primary-500/20">
            <mat-icon class="mr-2">save</mat-icon>
            Guardar Cambios
          </button>
        </div>
      </header>

      @if (selectedUserId) {
        <div class="grid grid-cols-1 gap-6">
          <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
            <table mat-table [dataSource]="permissions()" class="w-full">
              <ng-container matColumnDef="module">
                <th mat-header-cell *matHeaderCellDef class="!bg-slate-50 dark:!bg-slate-950/50 !text-slate-500 !font-bold !py-5">Módulo / Funcionalidad</th>
                <td mat-cell *matCellDef="let p" class="!py-5 font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-xs">
                  {{ p.module }}
                </td>
              </ng-container>

              <ng-container matColumnDef="read">
                <th mat-header-cell *matHeaderCellDef class="!bg-slate-50 dark:!bg-slate-950/50 !text-slate-500 !font-bold !py-5 text-center">Leer</th>
                <td mat-cell *matCellDef="let p" class="!py-5 text-center">
                  <mat-checkbox [(ngModel)]="p.can_read" color="primary"></mat-checkbox>
                </td>
              </ng-container>

              <ng-container matColumnDef="write">
                <th mat-header-cell *matHeaderCellDef class="!bg-slate-50 dark:!bg-slate-950/50 !text-slate-500 !font-bold !py-5 text-center">Escribir</th>
                <td mat-cell *matCellDef="let p" class="!py-5 text-center">
                  <mat-checkbox [(ngModel)]="p.can_write" color="primary"></mat-checkbox>
                </td>
              </ng-container>

              <ng-container matColumnDef="delete">
                <th mat-header-cell *matHeaderCellDef class="!bg-slate-50 dark:!bg-slate-950/50 !text-slate-500 !font-bold !py-5 text-center">Eliminar</th>
                <td mat-cell *matCellDef="let p" class="!py-5 text-center">
                  <mat-checkbox [(ngModel)]="p.can_delete" color="primary"></mat-checkbox>
                </td>
              </ng-container>

              <ng-container matColumnDef="see_all">
                <th mat-header-cell *matHeaderCellDef class="!bg-slate-50 dark:!bg-slate-950/50 !text-slate-500 !font-bold !py-5 text-center">Ver Todo</th>
                <td mat-cell *matCellDef="let p" class="!py-5 text-center">
                  @if (p.module === 'rutas') {
                    <mat-checkbox [(ngModel)]="p.can_see_all" color="warn"></mat-checkbox>
                  } @else {
                    <span class="text-slate-300 dark:text-slate-700">-</span>
                  }
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns;" class="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"></tr>
            </table>
          </div>
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-white/5">
          <div class="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center mb-6">
            <mat-icon class="!text-4xl text-slate-300">manage_accounts</mat-icon>
          </div>
          <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-2">Seleccione un usuario</h3>
          <p class="text-slate-500 max-w-sm text-center">Debe elegir un usuario del menú desplegable para configurar sus permisos individuales.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-checkbox.mat-primary {
      --mdc-checkbox-selected-focus-icon-color: var(--primary-500);
      --mdc-checkbox-selected-hover-icon-color: var(--primary-500);
      --mdc-checkbox-selected-icon-color: var(--primary-500);
      --mdc-checkbox-selected-pressed-icon-color: var(--primary-500);
    }
  `]
})
export class PermissionsComponent implements OnInit {
  users = signal<User[]>([]);
  selectedUserId: number | null = null;
  permissions = signal<any[]>([]);
  saving = signal(false);
  columns = ['module', 'read', 'write', 'delete', 'see_all'];

  modules = ['rutas', 'visitas', 'data', 'reports', 'merchandisers', 'users', 'chat', 'notifications'];

  constructor(private api: ApiService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.api.getUsers().subscribe((users: User[]) => this.users.set(users));
  }

  onUserChange(userId: number): void {
    this.api.getUserPermissions(userId).subscribe((userPerms: Permission[]) => {
      // Merge modules with existing perms
      const merged = this.modules.map(m => {
        const existing = userPerms.find(up => up.module === m);
        return existing || {
          module: m,
          can_read: true,
          can_write: false,
          can_delete: false,
          can_see_all: false
        };
      });
      this.permissions.set(merged);
    });
  }

  savePermissions(): void {
    if (!this.selectedUserId) return;
    this.saving.set(true);
    this.api.updateUserPermissions(this.selectedUserId, this.permissions()).subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open('Permisos actualizados con éxito', 'OK', { duration: 3000 });
      },
      error: () => this.saving.set(false)
    });
  }
}
