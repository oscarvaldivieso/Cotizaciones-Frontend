import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Bootstrap modules
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Components
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';

// Shared
import { SharedModule } from 'src/app/shared/shared.module';

// Services
import { ClientesService } from 'src/app/core/services/clientes.service';

// Models
import { Cliente } from 'src/app/models/cliente.model';

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
    RouterModule,
    SharedModule,
    BsDropdownModule,
    CreateComponent,
    EditComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  animations: [
    trigger('collapse', [
      state('void', style({ height: '0px', opacity: 0 })),
      state('*', style({ height: '*', opacity: 1 })),
      transition(':enter', [
        style({ height: '0px', opacity: 0 }),
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: '0px', opacity: 0 }))])
    ])
  ]
})
export class ListComponent implements OnInit, OnDestroy {

  Cliente: Cliente[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  showCreate = false;
  showEdit = false;
  clienteSeleccionado: Cliente | null = null;

  private destroy$ = new Subject<void>();

  constructor(private clientesService: ClientesService) { }

  ngOnInit(): void {
    console.log('✅ Componente de lista de clientes cargado');
    this.listarClientes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Filtra los clientes según el término de búsqueda
   */
  filteredClientes(): Cliente[] {
    if (!this.searchTerm) {
      return this.Cliente;
    }
    return this.Cliente.filter(c =>
      c.clie_Nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.clie_Identidad?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.clie_CorreoElectronico?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /**
   * Lista todos los clientes desde el servicio
   */
  listarClientes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientesService.listarClientes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<Cliente[]>) => {
          if (response.success) {
            this.Cliente = response.data;
            console.log('📦 Clientes cargados:', this.Cliente);
          } else {
            this.errorMessage = response.message || 'Error al cargar los clientes';
            Swal.fire('Error', this.errorMessage, 'error');
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          this.errorMessage = 'Error al conectar con el servidor: ' + error.message;
          console.error('❌ Error:', error);
          Swal.fire('Error', this.errorMessage, 'error');
          this.isLoading = false;
        }
      });
  }

  /**
   * Muestra/oculta el formulario de creación
   */
  toggleCreate(): void {
    this.showCreate = !this.showCreate;
    if (this.showCreate) {
      this.showEdit = false;
    }
  }

  /**
   * Cancela la creación y recarga la lista
   */
  cancelCreate(): void {
    this.showCreate = false;
    this.listarClientes();
  }

  /**
   * Edita un cliente
   */
  editarCliente(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.showEdit = true;
    this.showCreate = false;
  }

  /**
   * Cancela la edición
   */
  cancelEdit(): void {
    this.showEdit = false;
    this.clienteSeleccionado = null;
  }

  /**
   * Recarga la lista después de actualizar
   */
  recargarLista(): void {
    this.showEdit = false;
    this.clienteSeleccionado = null;
    this.listarClientes();
  }

  /**
   * Elimina un cliente
   */
  eliminarCliente(clienteId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el cliente seleccionado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientesService.eliminarCliente(clienteId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response: ApiResponse<any>) => {
              if (response.success) {
                Swal.fire({
                  title: '¡Eliminado!',
                  text: response.message || 'El cliente ha sido eliminado correctamente',
                  icon: 'success',
                  confirmButtonText: 'OK'
                });
                this.listarClientes();
              } else {
                // Mostrar mensaje del API cuando no se puede eliminar
                Swal.fire({
                  title: 'No se puede eliminar',
                  text: response.message || 'No se pudo eliminar el cliente',
                  icon: 'warning',
                  confirmButtonText: 'OK'
                });
              }
            },
            error: (error: any) => {
              console.error('Error al eliminar:', error);
              Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al eliminar el cliente',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          });
      }
    });
  }
}
