import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

// Shared
import { SharedModule } from 'src/app/shared/shared.module';

// Services
import { ViajesService } from 'src/app/core/services/viajes.service';
import { SucursalesService } from 'src/app/core/services/sucursales.service';
import { TransportistasService } from 'src/app/core/services/transportistas.service';
import { ColaboradoresService } from 'src/app/core/services/colaboradores.service';

// Models
import { Viaje, ColaboradorViaje } from 'src/app/models/viaje.model';
import { Sucursal } from 'src/app/models/sucursal.model';
import { Transportista } from 'src/app/models/transportista.model';
import { Colaborador } from 'src/app/models/colaborador.model';

interface ColaboradorConDistancia extends Colaborador {
  selected?: boolean;
}

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit, OnDestroy {

  viajeForm!: FormGroup;
  sucursales: Sucursal[] = [];
  transportistas: Transportista[] = [];
  colaboradores: ColaboradorConDistancia[] = [];

  isLoading = false;
  isSubmitting = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private viajesService: ViajesService,
    private sucursalesService: SucursalesService,
    private transportistasService: TransportistasService,
    private colaboradoresService: ColaboradoresService,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    console.log('✅ Componente de creación de viajes cargado');
    this.loadSucursales();
    this.loadTransportistas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    this.viajeForm = this.fb.group({
      viaj_Fecha: [today, Validators.required],
      sucu_Id: ['', Validators.required],
      tran_Id: ['', Validators.required]
    });
  }

  loadSucursales(): void {
    this.sucursalesService.listarSucursales()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.sucursales = response.data;
            console.log('📦 Sucursales cargadas:', this.sucursales);
          }
        },
        error: (error) => {
          console.error('❌ Error cargando sucursales:', error);
          this.toastr.error('Error al cargar las sucursales', 'Error');
        }
      });
  }

  loadTransportistas(): void {
    this.transportistasService.listarTransportistas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.transportistas = response.data;
            console.log('📦 Transportistas cargados:', this.transportistas);
          }
        },
        error: (error) => {
          console.error('❌ Error cargando transportistas:', error);
          this.toastr.error('Error al cargar los transportistas', 'Error');
        }
      });
  }

  onSucursalChange(event: any): void {
    const sucuId = event.target.value;
    if (sucuId) {
      this.loadColaboradores(parseInt(sucuId));
    } else {
      this.colaboradores = [];
    }
  }

  loadColaboradores(sucuId: number): void {
    this.isLoading = true;
    this.colaboradoresService.listarColaboradoresPorSucursal(sucuId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.colaboradores = response.data.map((c: Colaborador) => ({
              ...c,
              selected: false
            }));
            console.log('📦 Colaboradores cargados:', this.colaboradores);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Error cargando colaboradores:', error);
          this.toastr.error('Error al cargar los colaboradores', 'Error');
          this.isLoading = false;
        }
      });
  }

  toggleColaborador(colaborador: ColaboradorConDistancia): void {
    colaborador.selected = !colaborador.selected;
  }

  getSelectedColaboradores(): ColaboradorConDistancia[] {
    return this.colaboradores.filter(c => c.selected);
  }

  getDistanciaTotal(): number {
    return this.getSelectedColaboradores().reduce((total, c) => {
      return total + (c.cosu_DistanciaKm || 0);
    }, 0);
  }

  getTarifaTransportista(): number {
    const tranId = this.viajeForm.get('tran_Id')?.value;
    if (!tranId) return 0;

    const transportista = this.transportistas.find(t => t.tran_Id == tranId);
    return transportista?.tran_TarifaPorKm || 0;
  }

  onSubmit(): void {
    if (this.viajeForm.invalid) {
      this.toastr.warning('Por favor complete todos los campos requeridos', 'Formulario incompleto');
      return;
    }

    const selectedColaboradores = this.getSelectedColaboradores();
    if (selectedColaboradores.length === 0) {
      this.toastr.warning('Debe seleccionar al menos un colaborador', 'Sin colaboradores');
      return;
    }

    // Validar límite de 100km
    const distanciaTotal = this.getDistanciaTotal();
    if (distanciaTotal > 100) {
      this.toastr.error(`La distancia total (${distanciaTotal} km) excede el límite permitido de 100 km`, 'Límite excedido');
      return;
    }

    // Validate all selected colaboradores have distance
    const invalidColaboradores = selectedColaboradores.filter(c => !c.cosu_DistanciaKm || c.cosu_DistanciaKm <= 0);
    if (invalidColaboradores.length > 0) {
      this.toastr.error('Todos los colaboradores seleccionados deben tener una distancia válida', 'Distancia inválida');
      return;
    }

    this.isSubmitting = true;

    const viaje: Viaje = {
      viaj_Fecha: this.viajeForm.value.viaj_Fecha,
      sucu_Id: parseInt(this.viajeForm.value.sucu_Id),
      tran_Id: parseInt(this.viajeForm.value.tran_Id),
      usua_Creacion: 2, // TODO: Obtener del usuario autenticado
      colaboradores: selectedColaboradores.map(c => ({
        colb_Id: c.colb_Id!,
        clVj_DistanciaKm: c.cosu_DistanciaKm!
      }))
    };

    console.log('📤 Enviando viaje:', viaje);

    this.viajesService.insertarViaje(viaje)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toastr.success('Viaje registrado exitosamente', 'Éxito', {
              timeOut: 2000
            });
            console.log('✅ Viaje creado:', response.data);

            // Redirect to list after 1.5 seconds
            setTimeout(() => {
              this.router.navigate(['/oper/viajes/list']);
            }, 1500);
          } else {
            // Mostrar mensaje de error cuando success es false
            const errorMsg = response.message || 'Error al registrar el viaje';
            this.toastr.error(errorMsg, 'Error', { timeOut: 5000 });
            console.error('❌ Error de negocio:', response);
          }
          this.isSubmitting = false;
        },
        error: (error: any) => {
          console.error('❌ Error HTTP completo:', error);

          let errorMessage = 'Error al conectar con el servidor';

          // Si el error es directamente un string (como "La fecha del viaje no puede ser futura.")
          if (typeof error === 'string') {
            errorMessage = error;
          }
          // Si error.error existe
          else if (error.error) {
            // Si error.error tiene el mensaje (estructura de la API)
            if (error.error.message) {
              errorMessage = error.error.message;
            }
            // Si error.error es un string
            else if (typeof error.error === 'string') {
              errorMessage = error.error;
            }
          }
          // Si error tiene mensaje directamente
          else if (error.message) {
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
    this.router.navigate(['/oper/viajes/list']);
  }
}
