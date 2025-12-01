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
import { Vuelo } from 'src/app/models/vuelo.model';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { rest } from 'lodash';

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
    vuelo = new Vuelo(); 
    aerolineas: any[] = [];
    aeropuertos: any[] = [];
    aviones: any[] = [];
    serviciosDisponibles: any[] = [];
    
    serviciosSeleccionados: number[] = [];
    imagenesSeleccionadas: string[] = [];
    
    onServicioToggle(servicioId: number, event: any) {
      if (event.target.checked) {
        this.serviciosSeleccionados.push(servicioId);
      } else {
        this.serviciosSeleccionados = this.serviciosSeleccionados.filter(id => id !== servicioId);
      }
    }


  validationform!: UntypedFormGroup;
    tooltipvalidationform!: UntypedFormGroup;
    submit!: boolean;
    formsubmit!: boolean;
  
    constructor(private formBuilder: UntypedFormBuilder) { }
  
    ngOnInit(): void {
      this.obtenerAerolineas();
      this.obtenerAeropuertos();
      this.obtenerAviones();
      this.obtenerServicios();
      
      this.validationform = this.formBuilder.group({
        vuel_Nombre: ['', [Validators.required]],
        vuel_Descripcion: ['', [Validators.required]],
        vuel_Precio: ['', [Validators.required]],
        vuel_FechaPartida: ['', [Validators.required]],
        vuel_FechaLlegada: ['', [Validators.required]],
        aerl_Id: [null, [Validators.required]],
        avio_Id: [null, [Validators.required]],
        aerp_Salida_Id: [null, [Validators.required]],
        aerp_Llegada_Id: [null, [Validators.required]]
      });
    }

    obtenerAeropuertos() {
      this.http.get<any[]>('https://localhost:7091/ListarAeropuertos').subscribe({
        next: (data) => {
          this.aeropuertos = data;
        },
        error: (error) => {
          console.error('Error al obtener los aeropuertos', error);
        }
      });
    }

    obtenerAerolineas() {
      this.http.get<any[]>('https://localhost:7091/ListarAerolineas').subscribe({
        next: (data) => {
          this.aerolineas = data;
        },
        error: (error) => {
          console.error('Error al obtener las aerolineas:', error);
        }
      });
    }

    obtenerAviones() {
      this.http.get<any[]>('https://localhost:7091/ListarAviones').subscribe({
        next: (data) => {
          this.aviones = data;
        },
        error: (error) => {
          console.error('Error al obtener los aviones:', error);
        }
      });
    }

    obtenerServicios() {
      this.http.get<any[]>('https://localhost:7091/ListarServiciosDeVuelo').subscribe({
        next: (data) => {
          this.serviciosDisponibles = data;
        },
        error: (error) => {
          console.error('Error al obtener los restaurantes:', error);
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
      
        this.vuelo = {
          vuel_Id: 0,
          vuel_Nombre: formValues.vuel_Nombre,
          vuel_Descripcion:formValues.vuel_Descripcion,     
          vuel_FechaPartida:formValues.vuel_FechaPartida,     
          vuel_FechaLlegada: formValues.vuel_FechaLlegada,
          aerp_Salida_Id: formValues.aerp_Salida_Id,
          aerpSalida_Nombre: formValues.aerpSalida_Nombre,
          aerp_Llegada_Id: formValues.aerp_Llegada_Id,
          aerpLlegada_Nombre: formValues.aerpLlegada_Nombre,
          aerl_Id: formValues.aerl_Id,
          aerl_Nombre: '',
          avio_Id: formValues.avio_Id,
          avio_Modelo: '',
          vuel_Imagen: this.vuelo.vuel_Imagen || '',
          vuel_Precio: formValues.vuel_Precio,
          vuel_FechaCreacion: new Date(),
          usua_Creacion: 1,
          usua_Modificacion: 0,
          vuel_FechaModificacion: new Date(),
          servicios: this.serviciosSeleccionados,
          imagenes: this.imagenesSeleccionadas || [],
        };

        this.mostrarDatos();


        this.http.post('https://localhost:7091/InsertarVueloCompleto', this.vuelo).subscribe({
          next: () => {
            this.router.navigate(['/vuelo/vuelos/list']);
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
        console.log("Datos a enviar:", this.vuelo);
        console.log("Servicios seleccionados:", this.serviciosSeleccionados);
        console.log("Imágenes seleccionadas:", this.imagenesSeleccionadas);
        alert(`Datos del restaurante:\n${JSON.stringify(this.vuelo, null, 2)}\n\nImágenes:\n${this.imagenesSeleccionadas.join(', ')}`);
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
    url: 'https://localhost:7091/SubirImagenVuelo',
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
    paramName: 'file',
    maxFilesize: 50,
    acceptedFiles: 'image/*',
  };

  public dropzoneGaleriaConfig: DropzoneConfigInterface = {
    url: 'https://localhost:7091/SubirImagenVuelo',
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
      this.vuelo.vuel_Imagen = fileName;
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
