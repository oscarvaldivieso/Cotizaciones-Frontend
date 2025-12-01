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

// RxJS
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Services
import { ViajesService } from 'src/app/core/services/viajes.service';


// Temporary interface for viajes data structure
interface Viaje {
  viaj_Id?: number;
  viaj_Fecha?: string;
  sucursal_Nombre?: string;
  transportista_Nombre?: string;
  colaboradores_Count?: number;
  viaj_DistanciaTotal?: number;
  viaj_CostoTotal?: number;
  usua_Creacion?: number;
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

  viajes: Viaje[] = [];
  isLoading = false;
  searchTerm = '';
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private viajesService: ViajesService
  ) { }

  ngOnInit(): void {
    console.log('✅ Componente de lista de viajes cargado');
    this.loadViajes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadViajes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.viajesService.listarViajes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.viajes = response.data;
            console.log('📦 Viajes cargados:', this.viajes);
          } else {
            this.errorMessage = response.message || 'Error al cargar los viajes';
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
    this.router.navigate(['/oper/viajes/edit', id]);
  }

  onView(id: number): void {
    this.router.navigate(['/oper/viajes/details', id]);
  }

  onDelete(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este viaje?')) {
      console.log('Eliminando viaje con ID:', id);
      // TODO: Implementar la lógica de eliminación
    }
  }

  filteredViajes(): Viaje[] {
    if (!this.searchTerm) {
      return this.viajes;
    }
    return this.viajes.filter(v =>
      v.sucursal_Nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      v.transportista_Nombre?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
