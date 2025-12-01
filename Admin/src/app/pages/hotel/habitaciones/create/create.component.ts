import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import{CommonModule} from '@angular/common'; //Funciones de angular
import {Router, RouterModule} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Habitacion } from 'src/app/models/habitacion.model';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { group } from '@angular/animations';
import Swal from 'sweetalert2'
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropzoneModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule
  ],
  templateUrl: './create.component.html',    
  styleUrl: './create.component.scss'
})

export class CreateComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  habitacion = new Habitacion(); //Arreglo que usaremos para traer lo del endpoint
  HabitacionForm!: FormGroup;
  tiposhab: any[] = [];
  hoteles: any[] = [];
  habitacionForm!: FormGroup;

  @Output() cancelar = new EventEmitter<void>();  
  cancelarFormulario() {
    this.cancelar.emit();  
    // console.log("hola");
    console.log(this.cancelarFormulario);
  }

  validationform!: UntypedFormGroup;
  tooltipvalidationform!: UntypedFormGroup;
  submit!: boolean;
  formsubmit!: boolean;
  /**
   *
   */

  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.obtenerTiposHabitacion();
    this.obtenerHoteles();
    
    this.validationform = this.formBuilder.group({
      tipH_Id: ['', [Validators.required]],
      hote_Id: ['', [Validators.required]],
      habt_PrecioNoche: ['', [Validators.required]]
    });

    
  }

  obtenerTiposHabitacion() {
    this.http.get<any[]>('https://localhost:7091/ListarTiposHabitaciones').subscribe({
      next: (data) => {
        this.tiposhab = data;
      },
      error: (error) => {
        console.error('Error al obtener cargos:', error);
      }
    });
  }

  obtenerHoteles() {
    this.http.get<any[]>('https://localhost:7091/ListarHotel').subscribe({
      next: (data) => {
        this.hoteles = data;
      },
      error: (error) => {
        console.error('Error al obtener municipios:', error);
      }
    });
  }

  crearHabitacion() {
    this.submit = true;
    if (this.validationform.invalid) {
       return;
    }

    

    const formValues = this.validationform.value;
    // const HabitacionData = this.HabitacionForm.value;
    // HabitacionData.usua_Creacion = 1;
    // const fechaCreacion = new Date();
    // HabitacionData.usua_FechaCreacion = fechaCreacion.toLocaleDateString();
    this.habitacion = {
      habt_Id: 0,
      tipH_Id: formValues.tipH_Id,
      tipH_Descripcion: '',
      htel_Descripcion: '',
      hote_Id: formValues.hote_Id,
      habt_PrecioNoche: formValues.habt_PrecioNoche, 
      habt_FechaCreacion: new Date(),
      usua_Creacion: 1
    };

    this.http.post('https://localhost:7091/InsertarHabitacion', this.habitacion).subscribe({
      next: () => {
        this.router.navigate(['/hotel/habitaciones/list'])
        .then(() => {
          Swal.fire({
            title: 'Habitación insertada',
            text: 'La habitación ha sido insertada correctamente',
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#green',
            cancelButtonColor: '#red',
            confirmButtonText: 'Listo',
          })
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la habitación',
          text: 'Ocurrió un error al guardar la habitación. Intenta de nuevo.',
        });
      }
    });
  }

  get form(){
    return this.validationform.controls;
  }

  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  uploadedFiles: any[] = [];

  // File Upload
  imageURL: any;
  onUploadSuccess(event: any) {
    setTimeout(() => {
      this.uploadedFiles.push(event[0]);
    }, 0);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

//   campoInvalido(campo: string): boolean {
//     const control = this.HabitacionForm.get(campo);
//     return control?.invalid && control?.touched ? true : false;
//   }

// campoInvalido(campo: string): boolean {
//   const control = this.HabitacionForm.get(campo);
//   return !!(control && control.invalid && control.touched);
// }

// campoInvalido(campo: string): boolean {
//   return !!this.habitacionForm.get(campo)?.invalid && !!this.habitacionForm.get(campo)?.touched;
// }

}

// interceptor es una clase que uno lo retorna
