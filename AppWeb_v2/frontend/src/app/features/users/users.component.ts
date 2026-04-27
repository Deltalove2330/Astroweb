import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatTableModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatProgressSpinnerModule, MatSnackBarModule, MatTabsModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  users = signal<any[]>([]);
  showForm = signal(false);
  editingUser = signal<any>(null);
  columns = ['id', 'username', 'email', 'rol', 'perfil', 'activo', 'acciones'];

  analysts = signal<any[]>([]);
  clients = signal<any[]>([]);
  mercaderistas = signal<any[]>([]);

  rolesDisponibles = [
    { id: 8, nombre: 'Administrador' },
    { id: 2, nombre: 'Analista' },
    { id: 6, nombre: 'Supervisor' },
    { id: 1, nombre: 'Cliente' },
    { id: 5, nombre: 'Mercaderista' },
    { id: 7, nombre: 'Auditor' },
  ];

  createForm = this.fb.group({
    username: ['', Validators.required],
    email: [''],
    password: [''],
    id_rol: [2, Validators.required],
    id_perfil: [null as number | null],
  });

  // --- Analysts CRUD State ---
  showAnalystForm = signal(false);
  editingAnalyst = signal<any>(null);
  analystForm = this.fb.group({
    nombre_analista: ['', Validators.required],
    id_rol: [2]
  });

  // --- Clients CRUD State ---
  showClientForm = signal(false);
  editingClient = signal<any>(null);
  clientForm = this.fb.group({
    cliente: ['', Validators.required],
    rif: [''],
    id_categoria: [1],
    id_tipo_cliente: [1]
  });

  // --- Mercaderistas CRUD State ---
  showMercaderistaForm = signal(false);
  editingMercaderista = signal<any>(null);
  mercaderistaForm = this.fb.group({
    nombre: ['', Validators.required],
    cedula: ['', Validators.required],
    telefono: [''],
    tipo_mercaderista: ['MERCADERISTA'],
    activo: [true]
  });

  constructor(private api: ApiService, private fb: FormBuilder, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.api.getUsers().subscribe(data => { this.users.set(data); this.loading.set(false); });
    this.api.getAnalystsList().subscribe(data => this.analysts.set(data));
    this.api.getClients().subscribe(data => this.clients.set(data));
    this.api.getMercaderistas().subscribe(data => this.mercaderistas.set(data));
  }

  getProfilesForSelectedRole() {
    const rol = this.createForm.get('id_rol')?.value;
    if (rol === 1) return this.clients();
    if (rol === 2) return this.analysts();
    if (rol === 5) return this.mercaderistas();
    return [];
  }

  showProfileSelect() {
    const rol = this.createForm.get('id_rol')?.value;
    return [1, 2, 5].includes(rol || 0);
  }

  editUser(user: any): void {
    this.editingUser.set(user);
    this.showForm.set(true);
    this.createForm.patchValue({
      username: user.username,
      email: user.email,
      id_rol: user.id_rol,
      id_perfil: user.id_perfil,
    });
    this.createForm.get('password')?.clearValidators();
    this.createForm.get('password')?.updateValueAndValidity();
  }

  openCreateForm(): void {
    this.editingUser.set(null);
    this.createForm.reset({ id_rol: 2 });
    this.createForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.createForm.get('password')?.updateValueAndValidity();
    this.showForm.set(true);
  }

  saveUser(): void {
    if (this.createForm.invalid) return;
    this.saving.set(true);
    
    const user = this.editingUser();
    const data = { ...this.createForm.value };
    if (!data.password) delete data.password;

    const request = user 
      ? this.api.updateUser(user.id, data)
      : this.api.createUser(data);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.loadData();
        this.showForm.set(false);
        this.snack.open(user ? 'Usuario modificado' : 'Usuario creado', 'OK', { duration: 3000 });
      },
      error: (err) => {
        this.saving.set(false);
        this.snack.open(err.error?.detail ?? 'Error al guardar usuario', 'OK', { duration: 3000 });
      },
    });
  }

  getRoleClasses(idRol: number | undefined): string {
    const map: Record<number, string> = {
      8:  'bg-primary-500 text-white',
      2:  'bg-blue-50 text-blue-700 border border-blue-100',
      6:  'bg-emerald-50 text-emerald-700 border border-emerald-100',
      5:  'bg-amber-50 text-amber-700 border border-amber-100',
      7:  'bg-purple-50 text-purple-700 border border-purple-100',
    };
    return map[idRol ?? 0] ?? 'bg-slate-50 text-slate-700 border border-slate-100';
  }

  deleteUser(user: any): void {
    if (!confirm(`¿Eliminar al usuario "${user.username}"?`)) return;
    this.api.deleteUser(user.id).subscribe({
      next: () => { this.users.update((us) => us.filter((u) => u.id !== user.id)); },
      error: () => { this.snack.open('Error al eliminar usuario', 'OK', { duration: 3000 }); },
    });
  }

  // --- Analysts CRUD Methods ---
  openAnalystForm() {
    this.editingAnalyst.set(null);
    this.analystForm.reset({ id_rol: 2 });
    this.showAnalystForm.set(true);
  }

  editAnalyst(a: any) {
    this.editingAnalyst.set(a);
    this.analystForm.patchValue({ nombre_analista: a.nombre, id_rol: a.id_rol });
    this.showAnalystForm.set(true);
  }

  saveAnalyst() {
    if (this.analystForm.invalid) return;
    this.saving.set(true);
    const a = this.editingAnalyst();
    const request = a 
      ? this.api.updateAnalyst(a.id, this.analystForm.value)
      : this.api.createAnalyst(this.analystForm.value);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.api.getAnalystsList().subscribe(data => this.analysts.set(data));
        this.showAnalystForm.set(false);
        this.snack.open(a ? 'Analista modificado' : 'Analista creado', 'OK', { duration: 3000 });
      },
      error: () => { this.saving.set(false); this.snack.open('Error guardando analista', 'OK', { duration: 3000 }); }
    });
  }

  deleteAnalyst(a: any) {
    if (!confirm(`¿Eliminar analista "${a.nombre}"?`)) return;
    this.api.deleteAnalyst(a.id).subscribe({
      next: () => this.api.getAnalystsList().subscribe(data => this.analysts.set(data)),
      error: () => this.snack.open('Error al eliminar', 'OK', { duration: 3000 })
    });
  }

  // --- Clients CRUD Methods ---
  openClientForm() {
    this.editingClient.set(null);
    this.clientForm.reset({ id_categoria: 1, id_tipo_cliente: 1 });
    this.showClientForm.set(true);
  }

  editClient(c: any) {
    this.editingClient.set(c);
    this.clientForm.patchValue({ cliente: c.cliente || c.nombre, rif: c.rif, id_categoria: c.id_categoria, id_tipo_cliente: c.id_tipo_cliente });
    this.showClientForm.set(true);
  }

  saveClient() {
    if (this.clientForm.invalid) return;
    this.saving.set(true);
    const c = this.editingClient();
    const request = c 
      ? this.api.updateClient(c.id, this.clientForm.value)
      : this.api.createClient(this.clientForm.value);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.api.getClients().subscribe(data => this.clients.set(data));
        this.showClientForm.set(false);
        this.snack.open(c ? 'Cliente modificado' : 'Cliente creado', 'OK', { duration: 3000 });
      },
      error: () => { this.saving.set(false); this.snack.open('Error guardando cliente', 'OK', { duration: 3000 }); }
    });
  }

  deleteClient(c: any) {
    if (!confirm(`¿Eliminar cliente "${c.cliente || c.nombre}"?`)) return;
    this.api.deleteClient(c.id).subscribe({
      next: () => this.api.getClients().subscribe(data => this.clients.set(data)),
      error: () => this.snack.open('Error al eliminar', 'OK', { duration: 3000 })
    });
  }

  // --- Mercaderistas CRUD Methods ---
  openMercaderistaForm() {
    this.editingMercaderista.set(null);
    this.mercaderistaForm.reset({ tipo_mercaderista: 'MERCADERISTA', activo: true });
    this.showMercaderistaForm.set(true);
  }

  editMercaderista(m: any) {
    this.editingMercaderista.set(m);
    this.mercaderistaForm.patchValue({
      nombre: m.nombre || m.nombre_completo,
      cedula: m.cedula,
      telefono: m.telefono,
      tipo_mercaderista: m.tipo_mercaderista || 'MERCADERISTA',
      activo: m.activo
    });
    this.showMercaderistaForm.set(true);
  }

  saveMercaderista() {
    if (this.mercaderistaForm.invalid) return;
    this.saving.set(true);
    const m = this.editingMercaderista();
    const request = m 
      ? this.api.updateMercaderista(m.id, this.mercaderistaForm.value)
      : this.api.createMercaderista(this.mercaderistaForm.value);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.api.getMercaderistas().subscribe(data => this.mercaderistas.set(data));
        this.showMercaderistaForm.set(false);
        this.snack.open(m ? 'Mercaderista modificado' : 'Mercaderista creado', 'OK', { duration: 3000 });
      },
      error: () => { this.saving.set(false); this.snack.open('Error guardando mercaderista', 'OK', { duration: 3000 }); }
    });
  }

  deleteMercaderista(m: any) {
    if (!confirm(`¿Eliminar mercaderista "${m.nombre || m.nombre_completo}"?`)) return;
    this.api.deleteMercaderista(m.id).subscribe({
      next: () => this.api.getMercaderistas().subscribe(data => this.mercaderistas.set(data)),
      error: () => this.snack.open('Error al eliminar', 'OK', { duration: 3000 })
    });
  }
}
