import { Component, computed, signal, HostListener, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
  module?: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule, MatSidenavModule, MatListModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule, MatTooltipModule,
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  sidenavOpen = signal(window.innerWidth > 1024);
  isMobile = signal(window.innerWidth <= 1024);
  isDark = signal(false);
  notifCount = 0;

  user = computed(() => this.auth.currentUser());

  private navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', roles: [] },
    { label: 'Visitas', icon: 'map', route: '/visits', roles: ['admin', 'analyst', 'supervisor'], module: 'visitas' },
    { label: 'Rutas', icon: 'route', route: '/routes', roles: ['admin', 'analyst'], module: 'rutas' },
    { label: 'Puntos de Venta', icon: 'store', route: '/points', roles: ['admin', 'analyst', 'supervisor'] },
    { label: 'Fotos', icon: 'photo_library', route: '/photos', roles: ['admin', 'analyst', 'supervisor'] },
    { label: 'Reportería', icon: 'bar_chart', route: '/reports', roles: ['admin', 'analyst'], module: 'reports' },
    { label: 'Usuarios', icon: 'people', route: '/users', roles: ['admin'], module: 'users' },
    { label: 'Permisos', icon: 'admin_panel_settings', route: '/permissions', roles: ['admin'] },
    { label: 'Productos', icon: 'inventory_2', route: '/products', roles: ['admin', 'analyst'] },
    { label: 'Mis Rutas', icon: 'route', route: '/mercaderista', roles: ['mercaderista'] },
    { label: 'Chat', icon: 'chat', route: '/chat', roles: [], module: 'chat' },
    { label: 'Supervisor', icon: 'supervisor_account', route: '/supervisor', roles: ['admin', 'supervisor'] },
    { label: 'Solicitudes', icon: 'support_agent', route: '/atencion-cliente', roles: ['admin', 'analyst'] },
    { label: 'Mis Fotos', icon: 'photo_library', route: '/client', roles: ['client', 'coordinador_exclusivo'] },
    { label: 'Mis Visitas', icon: 'today', route: '/client/visits', roles: ['client', 'coordinador_exclusivo'] },
    { label: 'Data', icon: 'table_chart', route: '/data', roles: ['admin', 'analyst', 'client', 'coordinador_exclusivo'] },
  ];

  visibleNavItems = computed(() => {
    const u = this.user();
    if (!u) return [];
    
    return this.navItems.filter((item) => {
      // Admin bypass
      if (u.is_admin) return true;
      
      // Basic role check
      if (item.roles.length > 0 && !item.roles.includes(u.rol)) return false;
      
      // Granular module check
      if (item.module) {
        const perm = u.permisos?.find(p => p.module === item.module);
        if (perm && !perm.can_read) return false;
      }
      
      return true;
    });
  });

  constructor(
    private auth: AuthService, 
    private api: ApiService,
    private router: Router
  ) {
    this.loadNotifications();
  }

  ngOnInit(): void {
    // Inicializar tema
    this.initTheme();

    // Cerrar sidebar al navegar en móviles
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isMobile()) {
        this.sidenavOpen.set(false);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    const mobile = window.innerWidth <= 1024;
    this.isMobile.set(mobile);
    if (mobile && this.sidenavOpen()) {
      this.sidenavOpen.set(false);
    } else if (!mobile && !this.sidenavOpen()) {
      this.sidenavOpen.set(true);
    }
  }

  toggleSidenav(): void { this.sidenavOpen.update((v) => !v); }

  toggleTheme(): void {
    this.isDark.update(v => {
      const newVal = !v;
      localStorage.setItem('theme', newVal ? 'dark' : 'light');
      this.applyTheme(newVal);
      return newVal;
    });
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && systemDark);
    
    this.isDark.set(isDark);
    this.applyTheme(isDark);
  }

  private applyTheme(dark: boolean): void {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  logout(): void { this.auth.logout(); }

  private loadNotifications(): void {
    this.api.getRejectionNotifications().subscribe({
      next: (notifs) => { this.notifCount = notifs.length; },
      error: () => {},
    });
  }
}
