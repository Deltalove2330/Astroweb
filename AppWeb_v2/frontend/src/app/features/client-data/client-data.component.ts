import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as XLSX from 'xlsx';

import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-client-data',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatCardModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatSelectModule, MatInputModule,
    MatFormFieldModule, MatDatepickerModule, MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './client-data.component.html',
  styleUrls: ['./client-data.component.scss'],
  providers: [DatePipe]
})
export class ClientDataComponent implements OnInit {
  displayedColumns: string[] = [
    'fecha_balance', 'visita_id', 'region', 'cadena', 'pdv_nombre', 
    'mercaderista', 'producto', 'inv_inicial', 'inv_final', 'caras', 'precio_bs'
  ];
  
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = signal(false);
  
  // Filter Options from Backend
  filterOptions = signal({
    productos: [] as string[],
    cadenas: [] as string[],
    regiones: [] as string[],
    mercaderistas: [] as string[],
    pdvs: [] as any[]
  });

  filterForm = new FormGroup({
    fecha_inicio: new FormControl<Date | null>(null),
    fecha_fin: new FormControl<Date | null>(null),
    producto: new FormControl(''),
    cadena: new FormControl(''),
    region: new FormControl(''),
    mercaderista: new FormControl(''),
    pdv: new FormControl(''),
    visita_id: new FormControl('')
  });

  constructor(private api: ApiService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    // Set default dates to last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    this.filterForm.patchValue({
      fecha_inicio: startDate,
      fecha_fin: endDate
    });

    this.loadFilters();
    this.loadData();
  }

  loadFilters(): void {
    this.api.getClientDataFilters().subscribe({
      next: (data) => {
        this.filterOptions.set(data);
      }
    });
  }

  loadData(): void {
    this.loading.set(true);
    const formVals = this.filterForm.value;
    
    const params: any = {};
    if (formVals.fecha_inicio) params.fecha_inicio = this.datePipe.transform(formVals.fecha_inicio, 'yyyy-MM-dd');
    if (formVals.fecha_fin) params.fecha_fin = this.datePipe.transform(formVals.fecha_fin, 'yyyy-MM-dd');
    if (formVals.producto) params.producto = formVals.producto;
    if (formVals.cadena) params.cadena = formVals.cadena;
    if (formVals.region) params.region = formVals.region;
    if (formVals.mercaderista) params.mercaderista = formVals.mercaderista;
    if (formVals.pdv) params.pdv = formVals.pdv;
    if (formVals.visita_id) params.visita_id = formVals.visita_id;

    this.api.getClientDataBalances(params).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.loadData();
  }

  clearFilters(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    this.filterForm.reset({
      fecha_inicio: startDate,
      fecha_fin: endDate,
      producto: '',
      cadena: '',
      region: '',
      mercaderista: '',
      pdv: '',
      visita_id: ''
    });
    this.loadData();
  }

  exportExcel(): void {
    // Generate an Excel sheet from the current data source
    const dataToExport = this.dataSource.data.map(item => ({
      'Visita ID': item.visita_id,
      'Fecha': item.fecha_balance ? this.datePipe.transform(item.fecha_balance, 'dd/MM/yyyy HH:mm') : '',
      'Región': item.region,
      'Cadena': item.cadena,
      'PDV': item.pdv_nombre,
      'Mercaderista': item.mercaderista,
      'Producto': item.producto,
      'Categoría': item.categoria,
      'Inventario Inicial': item.inv_inicial,
      'Inventario Final': item.inv_final,
      'Caras': item.caras,
      'Precio Bs': item.precio_bs,
      'Precio $': item.precio_ds
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Balances');
    XLSX.writeFile(wb, `Data_Balances_${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmm')}.xlsx`);
  }
}
