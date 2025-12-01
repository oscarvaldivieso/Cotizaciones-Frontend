import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';

// Services
import { CotizacionesService } from 'src/app/core/services/cotizaciones.service';
import { CatalogosService } from 'src/app/core/services/catalogos.service';
import { ClientesService } from 'src/app/core/services/clientes.service';

// Models
import { CotizacionInsert } from 'src/app/models/cotizacion-insert.model';
import { Cliente } from 'src/app/models/cliente.model';
import { TipoSeguro } from 'src/app/models/tipo-seguro.model';
import { Moneda } from 'src/app/models/moneda.model';

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

  cotizacionForm!: UntypedFormGroup;
  submit: boolean = false;

  // Catálogos
  clientes: Cliente[] = [];
  tiposSeguro: TipoSeguro[] = [];
  monedas: Moneda[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private cotizacionesService: CotizacionesService,
    private catalogosService: CatalogosService,
    private clientesService: ClientesService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarClientes();
    this.cargarTiposSeguro();
    this.cargarMonedas();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  inicializarFormulario(): void {
    this.cotizacionForm = this.fb.group({
      clie_Id: ['', Validators.required],
      tiSe_Id: ['', Validators.required],
      mone_Id: ['', Validators.required],
      coti_DescripcionBien: ['', [Validators.required, Validators.minLength(10)]],
      coti_SumaAsegurada: ['', [Validators.required, Validators.min(1)]]
    });
  }

  /**
   * Carga la lista de clientes
   */
  cargarClientes(): void {
    this.clientesService.listarClientes()
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.clientes = response.data;
            console.log('✅ Clientes cargados:', this.clientes.length);
          }
        },
        error: (error) => {
          console.error('❌ Error al cargar clientes:', error);
          Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
        }
      });
  }

  /**
   * Carga los tipos de seguro
   */
  cargarTiposSeguro(): void {
    this.catalogosService.listarTiposSeguro()
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.tiposSeguro = response.data;
            console.log('✅ Tipos de seguro cargados:', this.tiposSeguro.length);
          }
        },
        error: (error) => {
          console.error('❌ Error al cargar tipos de seguro:', error);
          Swal.fire('Error', 'No se pudieron cargar los tipos de seguro', 'error');
        }
      });
  }

  /**
   * Carga las monedas
   */
  cargarMonedas(): void {
    this.catalogosService.listarMonedas()
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.monedas = response.data;
            console.log('✅ Monedas cargadas:', this.monedas.length);
          }
        },
        error: (error) => {
          console.error('❌ Error al cargar monedas:', error);
          Swal.fire('Error', 'No se pudieron cargar las monedas', 'error');
        }
      });
  }

  /**
   * Crea una nueva cotización
   */
  crearCotizacion(): void {
    this.submit = true;

    if (this.cotizacionForm.invalid) {
      Swal.fire('Formulario incompleto', 'Por favor complete todos los campos requeridos', 'warning');
      return;
    }

    const formValues = this.cotizacionForm.value;

    const nuevaCotizacion: CotizacionInsert = {
      clie_Id: formValues.clie_Id,
      tiSe_Id: formValues.tiSe_Id,
      mone_Id: formValues.mone_Id,
      coti_DescripcionBien: formValues.coti_DescripcionBien,
      coti_SumaAsegurada: formValues.coti_SumaAsegurada
    };

    this.cotizacionesService.insertarCotizacion(nuevaCotizacion)
      .subscribe({
        next: (response) => {
          if (response.success) {
            Swal.fire({
              title: '¡Cotización creada!',
              text: 'La cotización ha sido creada correctamente',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/general/cotizaciones/list']);
            });
          } else {
            Swal.fire('Error', response.message || 'No se pudo crear la cotización', 'error');
          }
        },
        error: (error) => {
          console.error('Error al crear cotización:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al crear la cotización',
            text: 'Ocurrió un error al guardar la cotización. Intenta de nuevo.',
          });
        }
      });
  }

  /**
   * Cancela y regresa al listado
   */
  cancelar(): void {
    this.router.navigate(['/general/cotizaciones/list']);
  }

  /**
   * Getter para acceder fácilmente a los controles del formulario
   */
  get form() {
    return this.cotizacionForm.controls;
  }
}
