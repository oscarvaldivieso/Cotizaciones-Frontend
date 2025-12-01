import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';

// Services
import { CatalogosService } from 'src/app/core/services/catalogos.service';
import { ClientesService } from 'src/app/core/services/clientes.service';

// Models
import { Cliente } from 'src/app/models/cliente.model';
import { TipoCliente } from 'src/app/models/tipo-cliente.model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {

  cliente = new Cliente();
  tiposCliente: TipoCliente[] = [];

  @Output() cancelar = new EventEmitter<void>();

  validationform!: UntypedFormGroup;
  submit: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private catalogosService: CatalogosService,
    private clientesService: ClientesService
  ) { }

  ngOnInit(): void {
    this.cargarTiposCliente();

    this.validationform = this.fb.group({
      tiCl_Id: ['', Validators.required],
      clie_Nombre: ['', Validators.required],
      clie_Identidad: ['', Validators.required],
      clie_FechaNacimiento: [''],
      clie_Telefono: ['', Validators.required],
      clie_CorreoElectronico: ['', [Validators.required, Validators.email]]
    });
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
          } else {
            console.error('Error en respuesta:', response.message);
          }
        },
        error: (error) => {
          console.error('❌ Error al cargar tipos de cliente:', error);
          Swal.fire('Error', 'No se pudieron cargar los tipos de cliente', 'error');
        }
      });
  }

  /**
   * Crea un nuevo cliente
   */
  crearCliente() {
    this.submit = true;
    if (this.validationform.invalid) {
      return;
    }

    const formValues = this.validationform.value;

    this.cliente = {
      clie_Id: 0,
      tiCl_Id: formValues.tiCl_Id,
      tipoCliente: '', // Se llenará desde el backend
      clie_Nombre: formValues.clie_Nombre,
      clie_Identidad: formValues.clie_Identidad,
      clie_FechaNacimiento: formValues.clie_FechaNacimiento || new Date(),
      clie_Telefono: formValues.clie_Telefono,
      clie_CorreoElectronico: formValues.clie_CorreoElectronico,
      clie_Activo: true,
      clie_FechaCreacion: new Date()
    };

    this.clientesService.insertarCliente(this.cliente).subscribe({
      next: (response) => {
        if (response.success) {
          Swal.fire({
            title: '¡Cliente creado!',
            text: 'El cliente ha sido creado correctamente',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.cancelar.emit();
          });
        } else {
          Swal.fire('Error', response.message || 'No se pudo crear el cliente', 'error');
        }
      },
      error: (error) => {
        console.error('Error al crear cliente:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el cliente',
          text: 'Ocurrió un error al guardar el cliente. Intenta de nuevo.',
        });
      }
    });
  }

  cancelarFormulario() {
    this.cancelar.emit();
  }

  get form() {
    return this.validationform.controls;
  }
}
