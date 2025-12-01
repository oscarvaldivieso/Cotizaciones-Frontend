import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import{CommonModule} from '@angular/common'; //Funciones de angular
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { RatingModule } from 'ngx-bootstrap/rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Paquete } from 'src/app/models/paquete.model';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { rest } from 'lodash';
import { any } from '@amcharts/amcharts5/.internal/core/util/Array';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    NgStepperModule,
    CdkStepperModule,
    RatingModule,
    FormsModule,
    DropzoneModule,
    ReactiveFormsModule,
    CommonModule,
    NgSelectModule,
    RouterModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class CreateComponent {
    http = inject(HttpClient);
    router = inject(Router);
    paquete = new Paquete(); 
    vuelos: any[] = [];
    restaurantes: any[] = [];
    habitaciones: any[] = [];
    actividadesDisponibles: any[] = [];
    
    actividadesSeleccionadas: number[] = [];
    imagenesSeleccionadas: string[] = [];
    
    onServicioToggle(servicioId: number, event: any) {
      if (event.target.checked) {
        this.actividadesSeleccionadas.push(servicioId);
      } else {
        this.actividadesSeleccionadas = this.actividadesSeleccionadas.filter(id => id !== servicioId);
      }
    }


    validationform!: UntypedFormGroup;
    tooltipvalidationform!: UntypedFormGroup;
    submit!: boolean;
    formsubmit!: boolean;
  
    constructor(private formBuilder: UntypedFormBuilder) { }
  
    ngOnInit(): void {
      this.obtenerVuelos();
      this.obtenerRestaurantes();
      this.obtenerHabitaciones();
      this.obtenerActividades();
      
      this.validationform = this.formBuilder.group({
        paqt_Nombre: ['', [Validators.required]],
        paqt_Descripcion: ['', [Validators.required]],
        paqt_PrecioPorPersona: ['', [Validators.required]],
        paqt_CantidadPersonas: ['', [Validators.required]],
        rest_Id: ['', [Validators.required]],
        vuel_Id: ['', [Validators.required]],
        habi_Id: ['', [Validators.required]]

      });
    }

    obtenerVuelos() {
      this.http.get<any[]>('https://localhost:7091/ListarVuelosDDL').subscribe({
        next: (data) => {
          this.vuelos = data;
        },
        error: (error) => {
          console.error('Error al obtener los vuelos', error);
        }
      });
    }

    obtenerRestaurantes() {
      this.http.get<any[]>('https://localhost:7091/ListarRestaurantesDDL').subscribe({
        next: (data) => {
          this.restaurantes = data;
        },
        error: (error) => {
          console.error('Error al obtener los restaurantes:', error);
        }
      });
    }

    obtenerActividades() {
      this.http.get<any[]>('https://localhost:7091/ListarActividades').subscribe({
        next: (data) => {
          this.actividadesDisponibles = data;
        },
        error: (error) => {
          console.error('Error al obtener los restaurantes:', error);
        }
      });
    }

    obtenerHabitaciones() {
      this.http.get<any[]>('https://localhost:7091/ListarHabitacionesDDL').subscribe({
        next: (data) => {
          this.habitaciones = data;
        },
        error: (error) => {
          console.error('Error al obtener las habitaciones:', error);
        }
      });
    }

    

    crearVuelo() {
        this.submit = true;
        // Verifica si el formulario es válido
        if (this.validationform.invalid) {
          alert('Por favor, completa todos los campos obligatorios.');
          return;
        }
      
        // Asigna los valores del formulario al modelo empleado
        const formValues = this.validationform.value;
      
        this.paquete = {
          paqt_Id: 0,
          paqt_Nombre: formValues.paqt_Nombre,
          paqt_Descripcion:formValues.paqt_Descripcion,     
          paqt_CantidadPersonas:formValues.paqt_CantidadPersonas,     
          paqt_PrecioPorPersona: formValues.paqt_PrecioPorPersona,
          vuel_Id: formValues.vuel_Id,
          vuel_Nombre: '',
          rest_Id: formValues.rest_Id,
          rest_Nombre: '',
          habi_Id: formValues.habi_Id,
          habt_Nombre: '',
          paqt_ImagenPortada: this.paquete.paqt_ImagenPortada || '',
          paqt_FechaCreacion: new Date(),
          usua_Creacion: 1,
          usua_Modificacion: 0,
          paqt_FechaModificacion: new Date(),
          actividades: this.actividadesSeleccionadas,
          imagenes: this.imagenesSeleccionadas || [],
        };

        this.mostrarDatos();


        this.http.post('https://localhost:7091/InsertarPaqueteCompleto', this.paquete).subscribe({
          next: () => {
            this.router.navigate(['/paquete/paquetes/list']);
            setTimeout(()=>{
              Swal.fire({
                title: 'Vuelo insertado',
                text: 'El vuelo ha sido insertado correctamente',
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: 'success',
                cancelButtonColor: 'danger',
                confirmButtonText: 'Listo',
              })
            })
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error al crear el vuelo',
              text: 'Ocurrió un error al guardar el vuelo. Intenta de nuevo.',
            });
          }
        });
      }

      mostrarDatos(): void {
        console.log("Datos a enviar:", this.paquete);
        console.log("Servicios seleccionados:", this.actividadesSeleccionadas);
        console.log("Imágenes seleccionadas:", this.imagenesSeleccionadas);
        alert(`Datos del restaurante:\n${JSON.stringify(this.paquete, null, 2)}\n\nImágenes:\n${this.imagenesSeleccionadas.join(', ')}`);
      }

      get form() {
        return this.validationform.controls;
      }
  



  change(event: any) {
  }

  max = 10;
  rate = 3;
  rate1 = 3;
  readrate = 4.5;
  isReadonly = true;
  x = 5;
  y = 2;

  hovermax = 5;
  hoverrate = 1;
  resetrate = 2;

  public dropzoneConfig: DropzoneConfigInterface = {
    url: 'https://localhost:7091/SubirImagenPaquete',
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
    paramName: 'file',
    maxFilesize: 50,
    acceptedFiles: 'image/*',
  };

  public dropzoneGaleriaConfig: DropzoneConfigInterface = {
    url: 'https://localhost:7091/SubirImagenPaquete',
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
    paramName: 'file',
    maxFilesize: 50,
    acceptedFiles: 'image/*'
  };

  uploadedFiles: any[] = [];
  uploadedFilesGaleria: any[] = [];

    // File Upload
    imageURL: any;

    onUploadSuccess(event: any) {
      const response = event[1]; // event[1] contiene la respuesta del servidor
      const fileName = response.fileName;
      this.paquete.paqt_ImagenPortada = fileName;
      this.uploadedFiles.push({
        ...event[0],
        dataURL: URL.createObjectURL(event[0]),
        name: fileName
      });
    }

    onUploadGaleriaSuccess(event: any) {
      const response = event[1];
      const fileName = response.fileName;
    
      // Evita duplicados en imagenesSeleccionadas
      if (!this.imagenesSeleccionadas.includes(fileName)) {
        this.imagenesSeleccionadas.push(fileName);
      }
    
      // Evita duplicados en uploadedFilesGaleria
      const alreadyUploaded = this.uploadedFilesGaleria.some(file => file.name === fileName);
      if (!alreadyUploaded) {
        this.uploadedFilesGaleria.push({
          ...event[0],
          dataURL: URL.createObjectURL(event[0]),
          name: fileName
        });
      }
    }

    fileChange(event: any) {
      let fileList: any = (event.target as HTMLInputElement);
      let file: File = fileList.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageURL = reader.result as string;
          document.querySelectorAll('#user-img').forEach((element: any) => {
            element.src = this.imageURL;
          });
      }
      reader.readAsDataURL(file)
    }


    // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  removeFileGaleria(event: any) {
    this.uploadedFilesGaleria.splice(this.uploadedFilesGaleria.indexOf(event), 1);
  }

}