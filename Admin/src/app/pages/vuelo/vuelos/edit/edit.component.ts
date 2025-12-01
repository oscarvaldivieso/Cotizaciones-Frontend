
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
import { Vuelo } from 'src/app/models/vuelo.model';
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
    vuelo = new Vuelo(); 
    aerolineas: any[] = [];
    aeropuertos: any[] = [];
    aviones: any[] = [];
    serviciosDisponibles:any[] = [];
    
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
        this.obtenerAerolineas();
        this.obtenerAeropuertos();
        this.obtenerAviones();
        this.obtenerServicios();

        const vueloId = this.route.snapshot.paramMap.get('id');
        if (vueloId) {
          this.obtenerVueloPorId(Number(vueloId));
        }


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

      obtenerVueloPorId(id: number) {
        this.http.get<any>(`https://localhost:7091/BuscarVuelo?id=${id}`).subscribe({
          next: (response) => {
            // Asegúrate de que el backend devuelve la respuesta en este formato
            this.vuelo = response.vuelo || {};
            this.serviciosSeleccionados = response.servicios.map((servicio: { serv_Id: number }) => servicio.serv_Id);
            this.imagenesSeleccionadas = response.imagenes.map((imagenes: { imAv_ImagenURL: string }) => imagenes.imAv_ImagenURL);
      
            // También podrías actualizar el formulario con los datos
            this.validationform.patchValue({
              vuel_Nombre: this.vuelo.vuel_Nombre || '',
              vuel_Descripcion: this.vuelo.vuel_Descripcion || '',
              vuel_Precio: this.vuelo.vuel_Precio || 0,
              vuel_FechaPartida:this.vuelo.vuel_FechaPartida || '',
              vuel_FechaLlegada: this.vuelo.vuel_FechaLlegada || '',
              aerl_Id: this.vuelo.aerl_Id || null,
              avio_Id: this.vuelo.avio_Id || null,
              aerp_Salida_Id: this.vuelo.aerp_Salida_Id || null,
              aerp_Llegada_Id: this.vuelo.aerp_Llegada_Id || null,
              vuel_Imagen: this.vuelo.vuel_Imagen || ''
            });

            // Mostrar las imágenes en Dropzone
            this.uploadedFilesGaleria = this.imagenesSeleccionadas.map(imagen => {
              const imagenUrl = `https://localhost:7091/images/vuelos/${imagen}`;
              return {
                dataURL: imagenUrl,
                name: imagen,
                size: 1234 // Puedes reemplazar este valor con el tamaño real si lo deseas
              };
            });


            // Mostrar la imagen en Dropzone
            const imagenUrl = `https://localhost:7091/images/vuelos/${this.vuelo.vuel_Imagen}`;
            this.uploadedFiles = [{
              dataURL: imagenUrl,
              name: this.vuelo.vuel_Imagen,
              size: 1234
            }];
          },
          error: (error) => {
            console.error('Error al obtener los datos del vuelo', error);
            Swal.fire('Error', 'No se pudieron cargar los datos del vuelo.', 'error');
          }
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
  
      
  
      editarVuelo() {

        this.mostrarDatos();
        this.submit = true;
      
        if (this.validationform.invalid) {
          alert('Por favor, completa todos los campos obligatorios.');
          return;
        }
      
        const formValues = this.validationform.value;
      
        this.vuelo = {
          vuel_Id: this.vuelo.vuel_Id,
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
          usua_Creacion: 0,
          usua_Modificacion: 1,
          vuel_FechaModificacion: new Date(),
          servicios: this.serviciosSeleccionados,
          imagenes: this.imagenesSeleccionadas || [],
        };
      
        this.http.post('https://localhost:7091/EditarVueloCompleto', this.vuelo).subscribe({
          next: () => {
            this.router.navigate(['/vuelo/vuelos/list']);
            setTimeout(() => {
              Swal.fire({
                title: 'Vuelo actualizado',
                text: 'El vuelo ha sido editado correctamente',
                icon: 'success',
                confirmButtonText: 'Listo',
              });
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error al editar el vuelo',
              text: 'Ocurrió un error al guardar los cambios. Intenta de nuevo.',
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
