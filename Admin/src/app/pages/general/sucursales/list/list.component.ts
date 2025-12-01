import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

// Bootstrap modules
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';

// Shared
import { SharedModule } from 'src/app/shared/shared.module';

// Service
import { SucursalesService } from 'src/app/core/services/sucursales.service';

// Models
import { Sucursal } from 'src/app/models/sucursal.model';

// RxJS
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface ApiResponse<T> {
  type: number;
  code: number;
  success: boolean;
  message: string;
  data: T;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    BsDropdownModule,
    PaginationModule,
    ModalModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})


export class ListComponent implements OnInit, OnDestroy {

  sucursales: Sucursal[] = [];
  isLoading = false;
  searchTerm = '';
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private sucursalesService: SucursalesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('✅ Componente de lista de sucursales cargado');
    this.loadSucursales();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSucursales(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.sucursalesService.listarSucursales()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.sucursales = response.data;
            console.log('📦 Sucursales cargadas:', this.sucursales);
          } else {
            this.errorMessage = response.message || 'Error al cargar las sucursales';
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          this.errorMessage = 'Error al conectar con el servidor: ' + error.message;
          console.error('❌ Error:', error);
          this.isLoading = false;
        }
      });
  }

  onEdit(id: number): void {
    this.router.navigate(['/general/sucursales/edit', id]);
  }

  onView(id: number): void {
    this.router.navigate(['/general/sucursales/details', id]);
  }

  onDelete(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta sucursal?')) {
      console.log('Eliminando sucursal con ID:', id);
      // Aquí irá la lógica de eliminar
    }
  }

  filteredSucursales(): Sucursal[] {
    if (!this.searchTerm) {
      return this.sucursales;
    }
    return this.sucursales.filter(s =>
      s.sucu_Nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      s.sucu_Codigo?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
