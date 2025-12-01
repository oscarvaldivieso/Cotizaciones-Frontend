import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

// Bootstrap modules
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Shared
import { SharedModule } from 'src/app/shared/shared.module';

// Services
import { CotizacionesService } from 'src/app/core/services/cotizaciones.service';

// Models
import { Cotizacion } from 'src/app/models/cotizacion.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    BsDropdownModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, OnDestroy {

  cotizaciones: Cotizacion[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  private destroy$ = new Subject<void>();

  constructor(private cotizacionesService: CotizacionesService) { }

  ngOnInit(): void {
    console.log('✅ Componente de lista de cotizaciones cargado');
    this.listarCotizaciones();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Filtra las cotizaciones según el término de búsqueda
   */
  filteredCotizaciones(): Cotizacion[] {
    if (!this.searchTerm) {
      return this.cotizaciones;
    }
    return this.cotizaciones.filter(c =>
      c.coti_Numero?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.clie_Nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.tipoSeguro?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.coti_DescripcionBien?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /**
   * Lista todas las cotizaciones desde el servicio
   */
  listarCotizaciones(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Enviar todos los parámetros en null para listar todo
    this.cotizacionesService.listarCotizaciones(null, null, null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.cotizaciones = response.data;
            console.log('✅ Cotizaciones cargadas:', this.cotizaciones.length);
          } else {
            this.errorMessage = response.message || 'Error al cargar cotizaciones';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Error al cargar las cotizaciones';
          console.error('❌ Error:', error);
        }
      });
  }

  /**
   * Elimina una cotización
   */
  eliminarCotizacion(coti_Id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cotizacionesService.eliminarCotizacion(coti_Id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.success) {
                Swal.fire('¡Eliminado!', 'La cotización ha sido eliminada.', 'success');
                this.listarCotizaciones();
              } else {
                Swal.fire('Error', response.message || 'No se pudo eliminar la cotización', 'error');
              }
            },
            error: (error) => {
              console.error('Error al eliminar:', error);
              Swal.fire('Error', 'Ocurrió un error al eliminar la cotización', 'error');
            }
          });
      }
    });
  }

  /**
   * Obtiene la clase de badge según el estado del correo
   */
  getCorreoBadgeClass(correoEnviado: boolean): string {
    return correoEnviado ? 'bg-success' : 'bg-warning';
  }

  /**
   * Obtiene el icono según el estado del correo
   */
  getCorreoIcon(correoEnviado: boolean): string {
    return correoEnviado ? 'ri-mail-check-line' : 'ri-mail-send-line';
  }
}
