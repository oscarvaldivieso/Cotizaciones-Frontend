import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';

// Services
import { CatalogosService } from 'src/app/core/services/catalogos.service';
import { ClientesService } from 'src/app/core/services/clientes.service';

// Models
import { Cliente } from 'src/app/models/cliente.model';
import { TipoCliente } from 'src/app/models/tipo-cliente.model';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  @Input() cliente!: Cliente;
  @Output() cancelar = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<void>();

  editForm!: FormGroup;
  submit = false;
  tiposCliente: TipoCliente[] = [];

  constructor(
    private fb: FormBuilder,
    private catalogosService: CatalogosService,
    private clientesService: ClientesService
  ) { }

  ngOnInit(): void {
    this.cargarTiposCliente();
    this.inicializarFormulario();
  }

  /**
   * Carga los tipos de cliente desde el servicio
   */
  cargarTiposCliente(): void {
    this.catalogosService.listarTiposCliente()
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.tiposCliente = response.data;
            console.log('✅ Tipos de cliente cargados:', this.tiposCliente);
          }
        },
        error: (error) => {
          console.error('❌ Error al cargar tipos de cliente:', error);
        }
      });
  }

  /**
   * Inicializa el formulario con los datos del cliente
   */
  inicializarFormulario(): void {
    this.editForm = this.fb.group({
      clie_Id: [this.cliente.clie_Id],
      tiCl_Id: [this.cliente.tiCl_Id, Validators.required],
      clie_Nombre: [this.cliente.clie_Nombre, Validators.required],
      clie_Identidad: [this.cliente.clie_Identidad, Validators.required],
      clie_FechaNacimiento: [this.formatDate(this.cliente.clie_FechaNacimiento)],
      clie_Telefono: [this.cliente.clie_Telefono, Validators.required],
      clie_CorreoElectronico: [this.cliente.clie_CorreoElectronico, [Validators.required, Validators.email]]
    });
  }

  /**
   * Formatea la fecha para el input type="date"
   */
  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Actualiza el cliente
   */
  editarCliente() {
    this.submit = true;
    if (this.editForm.invalid) {
      return;
    }

    const datosActualizados: Cliente = {
      ...this.cliente,
      ...this.editForm.value
    };

    this.clientesService.actualizarCliente(datosActualizados).subscribe({
      next: (response) => {
        if (response.success) {
          Swal.fire({
            title: '¡Actualizado!',
            text: 'El cliente se actualizó correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.actualizado.emit();
          });
        } else {
          Swal.fire('Error', response.message || 'No se pudo actualizar el cliente', 'error');
        }
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        Swal.fire('Error', 'No se pudo actualizar el cliente.', 'error');
      }
    });
  }

  cancelEdit() {
    this.cancelar.emit();
  }

  get form() {
    return this.editForm.controls;
  }
}
