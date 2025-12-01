import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import{CommonModule} from '@angular/common'; //Funciones de angular
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { RatingModule } from 'ngx-bootstrap/rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {Router, RouterModule, ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Hotel } from 'src/app/models/hotel.model';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { rest } from 'lodash';

@Component({
  selector: 'app-edit',
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
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  http = inject(HttpClient);
      router = inject(Router);
      hotel = new Hotel(); 
      municipios: any[] = [];
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
    
      constructor(private formBuilder: UntypedFormBuilder,
                  private route: ActivatedRoute,
      ) { }
    
      ngOnInit(): void {
        this.obtenerMunicipios();
        this.obtenerServicios();
        

        const hotelId = this.route.snapshot.paramMap.get('id');
        if (hotelId) {
          this.obtenerHotelPorId(Number(hotelId));
        }
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

      obtenerHotelPorId(id: number) {
        this.http.get<any>(`https://localhost:7091/BuscarHotel?id=${id}`).subscribe({
          next: (response) => {
            this.hotel = response.hotel || {};
            this.serviciosSeleccionados = response.servicios.map((servicio: { serv_Id: number }) => servicio.serv_Id);
            this.imagenesSeleccionadas = response.imagenes.map((imagenes: { iHot_ImgURL: string }) => imagenes.iHot_ImgURL);
      
            // También podrías actualizar el formulario con los datos
            this.validationform.patchValue({
              htel_Nombre: this.hotel.htel_Nombre || '',
              htel_Descripcion: this.hotel.htel_Descripcion || '',
              htel_Direccion: this.hotel.htel_Direccion || '',
              htel_NumeroHabitaciones: this.hotel.htel_NumeroHabitaciones || 0,
              htel_CantidadEstrellas: this.hotel.htel_CantidadEstrellas || 0,
              muni_Codigo: this.hotel.muni_Codigo || '',
              htel_Telefono: this.hotel.htel_Telefono || '',
              hote_ImagenPortada: this.hotel.hote_ImagenPortada || '',

            });

            // Mostrar las imágenes en Dropzone
            this.uploadedFilesGaleria = this.imagenesSeleccionadas.map(imagen => {
              const imagenUrl = `https://localhost:7091/images/hoteles/${imagen}`;
              return {
                dataURL: imagenUrl,
                name: imagen,
                size: 1234 // Puedes reemplazar este valor con el tamaño real si lo deseas
              };
            });


            // Mostrar la imagen en Dropzone
            const imagenUrl = `https://localhost:7091/images/hoteles/${this.hotel.hote_ImagenPortada}`;
            this.uploadedFiles = [{
              dataURL: imagenUrl,
              name: this.hotel.hote_ImagenPortada,
              size: 1234
            }];
          },
          error: (error) => {
            console.error('Error al obtener los datos del restaurante', error);
            Swal.fire('Error', 'No se pudieron cargar los datos del restaurante.', 'error');
          }
        });
      }
  

      obtenerServicios() {
        this.http.get<any[]>('https://localhost:7091/ListarServiciosHotel').subscribe({
          next: (data) => {
            this.serviciosDisponibles = data;
          },
          error: (error) => {
            console.error('Error al obtener los restaurantes:', error);
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
  
      
  
      editarHotel() {
        this.submit = true;
      
        if (this.validationform.invalid) {
          alert('Por favor, completa todos los campos obligatorios.');
          return;
        }
      
        const formValues = this.validationform.value;

        this.hotel = {
          htel_Id: this.hotel.htel_Id, // Asegúrate de tener este valor cargado previamente
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
          usua_Creacion: 0,
          usua_Modificacion: 1,
          htel_FechaModificacion: new Date(),
          servicios: this.serviciosSeleccionados,
          imagenes: this.imagenesSeleccionadas || [],
        };
      
      
        this.http.post('https://localhost:7091/EditarHotelCompleto', this.hotel).subscribe({
          next: () => {
            this.router.navigate(['/hotel/hoteles/list']);
            setTimeout(() => {
              Swal.fire({
                title: 'Hotel actualizado',
                text: 'El hotel ha sido editado correctamente',
                icon: 'success',
                confirmButtonText: 'Listo',
              });
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error al editar el hotel',
              text: 'Ocurrió un error al guardar los cambios. Intenta de nuevo.',
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
  
    removeFileGaleria(file: any) {
      let fileName = '';
    
      if (typeof file === 'string') {
        fileName = file;
        this.uploadedFilesGaleria = this.uploadedFilesGaleria.filter(f => f !== file);
      } else if (file?.name) {
        fileName = file.name;
        this.uploadedFilesGaleria = this.uploadedFilesGaleria.filter(f => f.name !== file.name);
      } else if (file?.dataURL) {
        this.uploadedFilesGaleria = this.uploadedFilesGaleria.filter(f => f.dataURL !== file.dataURL);
      }
    
      // Ahora también lo eliminamos del arreglo que se envía al backend
      if (fileName) {
        this.imagenesSeleccionadas = this.imagenesSeleccionadas.filter(nombre => nombre !== fileName);
      }
    }
}
