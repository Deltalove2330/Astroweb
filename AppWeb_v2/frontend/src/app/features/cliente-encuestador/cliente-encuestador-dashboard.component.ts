import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-cliente-encuestador-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, MatIconModule],
  templateUrl: './cliente-encuestador-dashboard.component.html',
  styles: [`
    .glass-panel {
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.5);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(99, 102, 241, 0.5);
      border-radius: 10px;
    }
  `]
})
export class ClienteEncuestadorDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  
  loading = true;
  kpis: any = null;
  medicos: any[] = [];
  
  // Filters
  filters = {
    fecha_desde: '',
    fecha_hasta: '',
    estados: [] as string[],
    ciudades: [] as string[],
    especialidades: [] as string[],
    universidades: [] as string[],
    centros: [] as string[],
    encuestadores: [] as string[]
  };

  // Filter Dropdown Data (normally loaded from API)
  catalogs = {
    estados: [], ciudades: [], especialidades: [], universidades: [], centros: [], encuestadores: []
  };

  // Charts Options
  doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'right', labels: { color: '#94a3b8' } } }
  };
  
  barOptions: ChartOptions<'bar'> = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  horizontalBarOptions: ChartOptions<'bar'> = {
    responsive: true, maintainAspectRatio: false, indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  // Chart Data
  espChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  valChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  pacChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  estChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  uniChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  cenChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  diasChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  ngOnInit() {
    this.loadData();
    this.loadFilters();
  }
  
  loadFilters() {
    // We can load filters from /api/cliente-encuestador/filtros later if needed
  }

  loadData() {
    this.loading = true;
    
    // Construct query string
    let params = new URLSearchParams();
    if (this.filters.fecha_desde) params.append('fecha_desde', this.filters.fecha_desde);
    if (this.filters.fecha_hasta) params.append('fecha_hasta', this.filters.fecha_hasta);
    
    this.http.get<any>(`${environment.apiUrl}/api/cliente-encuestador/kpis?${params.toString()}`).subscribe({
      next: (res: any) => {
        this.kpis = res;
        if (res.charts) {
          this.buildCharts(res.charts);
        }
        
        this.http.get<any>(`${environment.apiUrl}/api/cliente-encuestador/medicos?page=1&per_page=10&${params.toString()}`).subscribe((medRes: any) => {
          this.medicos = medRes.medicos || [];
          this.loading = false;
        });
      },
      error: () => this.loading = false
    });
  }

  buildCharts(charts: any) {
    // Helper to generate gradient or colors
    const bgColors = ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
    
    this.espChartData = {
      labels: charts.especialidades.map((c: any) => c.name),
      datasets: [{ data: charts.especialidades.map((c: any) => c.value), backgroundColor: bgColors, borderWidth: 0 }]
    };
    
    this.valChartData = {
      labels: charts.valor_consulta.map((c: any) => c.name),
      datasets: [{ data: charts.valor_consulta.map((c: any) => c.value), backgroundColor: bgColors, borderWidth: 0 }]
    };
    
    this.pacChartData = {
      labels: charts.pacientes_semana.map((c: any) => c.name),
      datasets: [{ data: charts.pacientes_semana.map((c: any) => c.value), backgroundColor: bgColors, borderWidth: 0 }]
    };

    this.estChartData = {
      labels: charts.estados.map((c: any) => c.name),
      datasets: [{ data: charts.estados.map((c: any) => c.value), backgroundColor: '#8b5cf6', borderRadius: 4 }]
    };

    this.uniChartData = {
      labels: charts.universidades.map((c: any) => c.name),
      datasets: [{ data: charts.universidades.map((c: any) => c.value), backgroundColor: ['#8b5cf6', '#0ea5e9'], borderRadius: 4 }]
    };

    this.cenChartData = {
      labels: charts.centros.map((c: any) => c.name),
      datasets: [{ data: charts.centros.map((c: any) => c.value), backgroundColor: ['#8b5cf6', '#0ea5e9'], borderRadius: 4 }]
    };

    this.diasChartData = {
      labels: charts.dias_consulta.map((c: any) => c.name),
      datasets: [{ data: charts.dias_consulta.map((c: any) => c.value), backgroundColor: bgColors, borderRadius: 4 }]
    };
  }
}
