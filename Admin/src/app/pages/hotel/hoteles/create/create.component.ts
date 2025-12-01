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
import { Hotel } from 'src/app/models/hotel.model';
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
    hotel = new Hotel(); 
    municipios: any[] = [];
    tiposrest: any[] = [];
    serviciosDisponibles = [
      { id: 18, nombre: 'Reservas privadas' },
      { id: 19, nombre: 'Alojamiento (habitaciones)' },
      { id: 20, nombre: 'Servicio de limpieza' },
      { id: 21, nombre: 'Desayuno incluido' },
      { id: 22, nombre: 'Recepción 24 horas' },
      { id: 23, nombre: 'Room Service' },
      { id: 24, nombre: 'Piscina disponible' },
      { id: 25, nombre: 'Gimnasio disponible' },
      { id: 26, nombre: 'Estacionamiento gratuito' },
      { id: 27, nombre: 'Sauna y spa' },
      { id: 28, nombre: 'Servicio de lavandería' },
      { id: 29, nombre: 'Television por cable' }
    ];
    
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
      this.obtenerMunicipios();
      
      this.validationform = this.formBuilder.group({
        htel_Nombre: ['', [Validators.required]],
        htel_Descripcion: ['', [Validators.required]],
        htel_Direccion: ['', [Validators.required]],
        htel_NumeroHabitaciones: [0, [Validators.required]],
        htel_CantidadEstrellas: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
        muni_Codigo: ['', [Validators.required]],
       htel_Telefono: ['', [Validators.required, Validators.pattern('^[0-9]{7,15}$')]]

      });
    }

    obtenerTiposRestaurantes() {
      this.http.get<any[]>('https://localhost:7091/ListarTiposRestaurantes').subscribe({
        next: (data) => {
          this.tiposrest = data;
        },
        error: (error) => {
          console.error('Error al obtener los tipos de restaurante:', error);
        }
      });
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

    

    

    crearHotel() {
        this.submit = true;
        // Verifica si el formulario es válido
        if (this.validationform.invalid) {
          alert('Por favor, completa todos los campos obligatorios.');
          return;
        }
      
        // Asigna los valores del formulario al modelo empleado
        const formValues = this.validationform.value;
      
        this.hotel = {
          htel_Id: 0,
          htel_Nombre: formValues.htel_Nombre,
          htel_Descripcion:formValues.htel_Descripcion,     
          htel_Direccion:formValues.htel_Direccion,     
          muni_Codigo: formValues.muni_Codigo,
          muni_Nombre: '',
          depa_Nombre:'',
          hote_ImagenPortada: this.hotel.hote_ImagenPortada || '',
          htel_Telefono: formValues.htel_Telefono,
          htel_CantidadEstrellas: formValues.htel_CantidadEstrellas,
          htel_NumeroHabitaciones: formValues.htel_NumeroHabitaciones || 0,
          htel_FechaCreacion: new Date(),
          usua_Creacion: 1,
          usua_Modificacion: 0,
          htel_FechaModificacion: new Date(),
          servicios: this.serviciosSeleccionados,
          imagenes: this.imagenesSeleccionadas || [],
        };

        this.mostrarDatos();


        this.http.post('https://localhost:7091/InsertarHotelCompleto', this.hotel).subscribe({
          next: () => {
            this.router.navigate(['/hotel/hoteles/list']);
            setTimeout(()=>{
              Swal.fire({
                title: 'Hotel insertado',
                text: 'El hotel ha sido insertado correctamente',
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
              title: 'Error al crear el hotel',
              text: 'Ocurrió un error al guardar el hotel. Intenta de nuevo.',
            });
          }
        });
      }

      mostrarDatos(): void {
        console.log("Datos a enviar:", this.hotel);
        console.log("Servicios seleccionados:", this.serviciosSeleccionados);
        console.log("Imágenes seleccionadas:", this.imagenesSeleccionadas);
        alert(`Datos del restaurante:\n${JSON.stringify(this.hotel, null, 2)}\n\nImágenes:\n${this.imagenesSeleccionadas.join(', ')}`);
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
    url: 'https://localhost:7091/SubirImagenHotel',
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
    paramName: 'file',
    maxFilesize: 50,
    acceptedFiles: 'image/*',
  };

  public dropzoneGaleriaConfig: DropzoneConfigInterface = {
    url: 'https://localhost:7091/SubirImagenHotel',
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
      this.hotel.hote_ImagenPortada = fileName;
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
