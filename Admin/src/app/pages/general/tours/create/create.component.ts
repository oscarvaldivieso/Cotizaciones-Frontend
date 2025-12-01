import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import{CommonModule} from '@angular/common'; //Funciones de angular
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tour } from 'src/app/models/tour.model';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { group } from '@angular/animations';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropzoneModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './create.component.html',    
  styleUrl: './create.component.scss'
})

export class CreateComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  tour = new Tour(); //Arreglo que usaremos para traer lo del endpoint
  tourForm!: FormGroup;
  municipios: any[] = [];
  actividades: any[] = [];

  @Output() cancelar = new EventEmitter<void>();  
  cancelarFormulario() {
    this.cancelar.emit();  
    // console.log("hola");
    console.log(this.cancelarFormulario);
  }

  obtenerMunicipios() {
    this.http.get<any[]>('https://localhost:7091/ListarMunicipios').subscribe({
      next: (data) => {
        this.municipios = data;
      },
      error: (error) => {
        console.error('Error al obtener municipios:', error);
      }
    });
  }

  obtenerActividades() {
    this.http.get<any[]>('https://localhost:7091/ListarActividades').subscribe({
      next: (data) => {
        this.actividades = data;
      },
      error: (error) => {
        console.error('Error al obtener actividades:', error);
      }
    });
  }

  validationform!: UntypedFormGroup;
  tooltipvalidationform!: UntypedFormGroup;
  submit!: boolean;
  formsubmit!: boolean;
  /**
   *
   */
  constructor(private fb:UntypedFormBuilder) {
    
  }

  ngOnInit(): void {
    this.obtenerMunicipios();
    this.obtenerActividades();
    this.validationform = this.fb.group({
      acti_Id: ['', Validators.required], 
      tour_Direccion: ['', Validators.required], 
      muni_Codigo: ['', Validators.required]
    })
  }

  crearTour() {
    

    this.submit = true;
    if (this.validationform.invalid) {
       return;
    }

    const formValues = this.validationform.value;
    // const tourData = this.tourForm.value;
    // tourData.usua_Creacion = 1;
    // const fechaCreacion = new Date();
    // tourData.tour_FechaCreacion = fechaCreacion.toLocaleDateString();

    this.tour = {
      tour_Id: 0,
      acti_Id: formValues.acti_Id,
      acti_Descripcion: '',
      tour_Direccion: formValues.tour_Direccion,
      muni_Codigo: formValues.muni_Codigo,
      muni_Nombre: '',
      tour_FechaCreacion: new Date(),
      usua_Creacion: 1
    };

    this.http.post('https://localhost:7091/InsertarTour', this.tour).subscribe({
      next: () => {
          this.cancelarFormulario();
          setTimeout(() => {
            Swal.fire({
              title: 'Tour insertado',
              text: 'El tour ha sido insertado correctamente',
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#green',
              cancelButtonColor: '#red',
              confirmButtonText: 'Listo',
            })
          })
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el tour',
          text: 'Ocurrió un error al guardar el tour. Intenta de nuevo.',
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
//     const control = this.tourForm.get(campo);
//     return control?.invalid && control?.touched ? true : false;
//   }

// campoInvalido(campo: string): boolean {
//   const control = this.tourForm.get(campo);
//   return !!(control && control.invalid && control.touched);
// }

campoInvalido(campo: string): boolean {
  return !!this.tourForm.get(campo)?.invalid && !!this.tourForm.get(campo)?.touched;
}

}

// interceptor es una clase que uno lo retorna
