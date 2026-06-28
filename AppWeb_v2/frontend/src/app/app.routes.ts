import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'login-mercaderista',
    loadComponent: () => import('./features/auth/login-mercaderista/login-mercaderista.component').then((m) => m.LoginMercaderistaComponent),
  },

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'centro-mando',
        loadComponent: () => import('./features/centro-mando/centro-mando.component').then((m) => m.CentroMandoComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'superadmin', 'analyst'] },
      },
      {
        path: 'visits',
        loadComponent: () => import('./features/visits/visits.component').then((m) => m.VisitsComponent),
      },
      {
        path: 'routes',
        loadComponent: () => import('./features/routes/routes.component').then((m) => m.RoutesComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'analyst'] },
      },
      {
        path: 'points',
        loadComponent: () => import('./features/visits/points/points.component').then((m) => m.PointsComponent),
      },
      {
        path: 'photos',
        loadComponent: () => import('./features/photos/photos.component').then((m) => m.PhotosComponent),
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then((m) => m.ReportsComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then((m) => m.UsersComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'client-categories',
        loadComponent: () => import('./features/client-categories/client-categories.component').then((m) => m.ClientCategoriesComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'permissions',
        loadComponent: () => import('./features/admin/permissions.component').then((m) => m.PermissionsComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'sessions',
        loadComponent: () => import('./features/admin/sessions/sessions.component').then((m) => m.SessionsComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'audit',
        loadComponent: () => import('./features/admin/audit-log/audit-log.component').then((m) => m.AuditLogComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'chat',
        loadComponent: () => import('./features/chat/chat.component').then((m) => m.ChatComponent),
      },
      {
        path: 'supervisor',
        loadComponent: () => import('./features/supervisor/supervisor.component').then((m) => m.SupervisorComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'supervisor'] },
      },
      {
        path: 'auditor',
        loadComponent: () => import('./features/auditor/auditor.component').then((m) => m.AuditorComponent),
      },
      {
        path: 'atencion-cliente',
        loadComponent: () => import('./features/atencion-cliente/atencion-cliente.component').then((m) => m.AtencionClienteComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'atc'] },
      },
      {
        path: 'client-photos',
        canActivate: [roleGuard],
        data: { roles: ['client', 'coordinador_exclusivo'] },
        loadComponent: () => import('./features/client-photos/client-photos.component').then(m => m.ClientPhotosComponent)
      },
      {
        path: 'data',
        canActivate: [roleGuard],
        data: { roles: ['client', 'coordinador_exclusivo', 'admin', 'analyst'] },
        loadComponent: () => import('./features/client-data/client-data.component').then(m => m.ClientDataComponent)
      },
      {
        path: 'revision-visitas',
        canActivate: [roleGuard],
        data: { roles: ['admin', 'analyst', 'supervisor'] },
        loadComponent: () => import('./features/revision-visitas/revision-visitas.component').then(m => m.RevisionVisitasComponent)
      },
      {
        path: 'client',
        loadComponent: () => import('./features/client-photos/client-photos.component').then(m => m.ClientPhotosComponent),
        canActivate: [roleGuard],
        data: { roles: ['client', 'coordinador_exclusivo'] },
      },
      {
        path: 'client/visits',
        loadComponent: () => import('./features/client-visits/client-visits.component').then(m => m.ClientVisitsComponent),
        canActivate: [roleGuard],
        data: { roles: ['client', 'coordinador_exclusivo'] },
      },
      {
        path: 'mercaderista',
        canActivate: [roleGuard],
        data: { roles: ['mercaderista', 'admin'] },
        loadComponent: () => import('./features/mercaderista/mercaderista.component').then((m) => m.MercaderistaComponent),
      },
      {
        path: 'products',
        loadComponent: () => import('./features/atencion-cliente/productos/productos.component').then(m => m.ProductosComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'atc'] },
      },
      {
        path: 'data',
        loadComponent: () => import('./features/data/data.component').then((m) => m.DataComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'analyst'] },
      },
    ],
  },

  {
    path: 'unauthorized',
    loadComponent: () => import('./features/auth/unauthorized/unauthorized.component').then((m) => m.UnauthorizedComponent),
  },
  { path: '**', redirectTo: '/login' },
];
