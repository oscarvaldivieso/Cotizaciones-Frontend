import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

// Shared
import { SharedModule } from 'src/app/shared/shared.module';

// Services & Models
import { ColaboradoresService } from 'src/app/core/services/colaboradores.service';
import { SucursalesService } from 'src/app/core/services/sucursales.service';
import { ColaboradorInsert, ColaboradorSucursalInsert } from 'src/app/models/colaborador-insert.model';
import { Sucursal } from 'src/app/models/sucursal.model';

interface SucursalAsignada {
  sucursal: Sucursal;
  distancia: number;
}

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit, OnDestroy {

  colaboradorForm!: FormGroup;
  sucursales: Sucursal[] = [];
  sucursalesAsignadas: SucursalAsignada[] = [];

  selectedSucursalId: number | null = null;
  distanciaInput: number = 0;

  isLoading = false;
  isSubmitting = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private colaboradoresService: ColaboradoresService,
    private sucursalesService: SucursalesService,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadSucursales();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.colaboradorForm = this.fb.group({
      colb_Codigo: ['', [Validators.required, Validators.maxLength(20)]],
      colb_Identidad: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      colb_NombreCompleto: ['', [Validators.required, Validators.maxLength(200)]],
      colb_Telefono: ['', [Validators.pattern(/^\d{8}$/)]],
      colb_Sexo: ['M', Validators.required]
    });
  }

  loadSucursales(): void {
    this.isLoading = true;
    this.sucursalesService.listarSucursales()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.sucursales = response.data;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Error cargando sucursales:', error);
          this.toastr.error('Error al cargar las sucursales', 'Error');
          this.isLoading = false;
        }
      });
  }

  // Validaciones para agregar sucursal
  canAddSucursal(): boolean {
    if (!this.selectedSucursalId || !this.distanciaInput) {
      return false;
    }

    // Validar que la distancia esté en el rango correcto (0 < distancia <= 50)
    if (this.distanciaInput <= 0 || this.distanciaInput > 50) {
      return false;
    }

    // Validar que no esté ya asignada
    const yaAsignada = this.sucursalesAsignadas.some(
      sa => sa.sucursal.sucu_Id === this.selectedSucursalId
    );

    return !yaAsignada;
  }

  getDistanciaValidationMessage(): string {
    if (!this.distanciaInput) {
      return '';
    }
    if (this.distanciaInput <= 0) {
      return 'La distancia debe ser mayor que 0';
    }
    if (this.distanciaInput > 50) {
      return 'La distancia no puede ser mayor que 50 km';
    }
    return '';
  }

  isSucursalAsignada(sucuId: number): boolean {
    return this.sucursalesAsignadas.some(sa => sa.sucursal.sucu_Id === sucuId);
  }

  agregarSucursal(): void {
    if (!this.canAddSucursal()) {
      if (this.isSucursalAsignada(this.selectedSucursalId!)) {
        this.toastr.warning('Esta sucursal ya está asignada', 'Sucursal duplicada');
      } else if (this.distanciaInput <= 0) {
        this.toastr.warning('La distancia debe ser mayor que 0', 'Distancia inválida');
      } else if (this.distanciaInput > 50) {
        this.toastr.warning('La distancia no puede ser mayor que 50 km', 'Distancia inválida');
      }
      return;
    }

    const sucursal = this.sucursales.find(s => s.sucu_Id === this.selectedSucursalId);
    if (sucursal) {
      this.sucursalesAsignadas.push({
        sucursal: sucursal,
        distancia: this.distanciaInput
      });

      // Limpiar selección
      this.selectedSucursalId = null;
      this.distanciaInput = 0;

      this.toastr.success('Sucursal agregada correctamente', 'Éxito');
    }
  }

  eliminarSucursal(index: number): void {
    const sucursal = this.sucursalesAsignadas[index];
    this.sucursalesAsignadas.splice(index, 1);
    this.toastr.info(`Sucursal "${sucursal.sucursal.sucu_Nombre}" eliminada`, 'Eliminada');
  }

  getSucursalesDisponibles(): Sucursal[] {
    return this.sucursales.filter(s => !this.isSucursalAsignada(s.sucu_Id!));
  }

  onSubmit(): void {
    // Validar formulario
    if (this.colaboradorForm.invalid) {
      Object.keys(this.colaboradorForm.controls).forEach(key => {
        this.colaboradorForm.get(key)?.markAsTouched();
      });
      this.toastr.warning('Por favor complete todos los campos requeridos correctamente', 'Formulario incompleto');
      return;
    }

    // Validar que tenga al menos una sucursal
    if (this.sucursalesAsignadas.length === 0) {
      this.toastr.warning('Debe asignar al menos una sucursal', 'Sin sucursales');
      return;
    }

    this.isSubmitting = true;

    const colaborador: ColaboradorInsert = {
      colb_Codigo: this.colaboradorForm.value.colb_Codigo,
      colb_Identidad: this.colaboradorForm.value.colb_Identidad,
      colb_NombreCompleto: this.colaboradorForm.value.colb_NombreCompleto,
      colb_Telefono: this.colaboradorForm.value.colb_Telefono || null,
      colb_Sexo: this.colaboradorForm.value.colb_Sexo,
      usua_Creacion: 2, // TODO: Obtener del usuario autenticado
      sucursales: this.sucursalesAsignadas.map(sa => ({
        sucu_Id: sa.sucursal.sucu_Id,
        coSu_DistanciaKm: sa.distancia
      }))
    };

    console.log('📤 Enviando colaborador:', colaborador);

    this.colaboradoresService.insertarColaborador(colaborador)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toastr.success('Colaborador registrado exitosamente', 'Éxito', {
              timeOut: 2000
            });
            console.log('✅ Colaborador creado:', response.data);

            setTimeout(() => {
              this.router.navigate(['/general/colaboradores/list']);
            }, 1500);
          } else {
            const errorMsg = response.message || 'Error al registrar el colaborador';
            this.toastr.error(errorMsg, 'Error', { timeOut: 5000 });
            console.error('❌ Error de negocio:', response);
          }
          this.isSubmitting = false;
        },
        error: (error: any) => {
          console.error('❌ Error HTTP completo:', error);

          let errorMessage = 'Error al conectar con el servidor';

          if (typeof error === 'string') {
            errorMessage = error;
          } else if (error.error) {
            if (error.error.message) {
              errorMessage = error.error.message;
            } else if (typeof error.error === 'string') {
              errorMessage = error.error;
            }
          } else if (error.message) {
            errorMessage = error.message;
          }

          this.toastr.error(errorMessage, 'Error', {
            timeOut: 5000,
            progressBar: true
          });
          this.isSubmitting = false;
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/general/colaboradores/list']);
  }

  // Helper para mostrar errores de validación
  getFieldError(fieldName: string): string {
    const field = this.colaboradorForm.get(fieldName);
    if (field?.hasError('required') && field.touched) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('pattern')) {
      if (fieldName === 'colb_Identidad') {
        return 'La identidad debe tener exactamente 13 dígitos';
      }
      if (fieldName === 'colb_Telefono') {
        return 'El teléfono debe tener exactamente 8 dígitos';
      }
    }
    if (field?.hasError('maxLength')) {
      return `Máximo ${field.errors?.['maxLength'].requiredLength} caracteres`;
    }
    return '';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.colaboradorForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
}
