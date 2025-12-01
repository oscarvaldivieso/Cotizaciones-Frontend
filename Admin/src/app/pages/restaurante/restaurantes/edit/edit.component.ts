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
import { Restaurante } from 'src/app/models/restaurante.model';
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
      restaurante = new Restaurante(); 
      municipios: any[] = [];
      tiposrest: any[] = [];
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
        this.obtenerTiposRestaurantes();
        this.obtenerServicios();
        

        const restauranteId = this.route.snapshot.paramMap.get('id');
        if (restauranteId) {
          this.obtenerRestaurantePorId(Number(restauranteId));
        }
        this.validationform = this.formBuilder.group({
          rest_Nombre: ['', [Validators.required]],
          rest_Descripcion: ['', [Validators.required]],
          rest_Direccion: ['', [Validators.required]],
          rest_CantidadEstrellas: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
          muni_Codigo: ['', [Validators.required]],
          tRes_Id: [null, [Validators.required]],
          rest_Telefono: ['', [Validators.required, Validators.pattern('^[0-9]{7,15}$')]],
          rest_esPetFriendly: [false],
          rest_tieneWifi: [false],
          rest_RangoPrecios: ['', [Validators.required]]
  
        });
      }

      obtenerRestaurantePorId(id: number) {
        this.http.get<any>(`https://localhost:7091/BuscarRestaurante?id=${id}`).subscribe({
          next: (response) => {
            // Asegúrate de que el backend devuelve la respuesta en este formato
            this.restaurante = response.restaurante || {};
            this.serviciosSeleccionados = response.servicios.map((servicio: { serv_Id: number }) => servicio.serv_Id);
            this.imagenesSeleccionadas = response.imagenes.map((imagenes: { iRes_ImgURL: string }) => imagenes.iRes_ImgURL);
      
            // También podrías actualizar el formulario con los datos
            this.validationform.patchValue({
              rest_Nombre: this.restaurante.rest_Nombre,
              rest_Descripcion: this.restaurante.rest_Descripcion,
              rest_Direccion: this.restaurante.rest_Direccion,
              rest_CantidadEstrellas: this.restaurante.rest_CantidadEstrellas,
              muni_Codigo: this.restaurante.muni_Codigo,
              tRes_Id: this.restaurante.tRes_Id,
              rest_Telefono: this.restaurante.rest_Telefono,
              rest_esPetFriendly: this.restaurante.rest_esPetFriendly,
              rest_tieneWifi: this.restaurante.rest_tieneWifi,
              rest_RangoPrecios: this.restaurante.rest_RangoPrecios,
              rest_ImagenPortada: this.restaurante.rest_ImagenPortada || '',

            });

            // Mostrar las imágenes en Dropzone
            this.uploadedFilesGaleria = this.imagenesSeleccionadas.map(imagen => {
              const imagenUrl = `https://localhost:7091/images/restaurantes/${imagen}`;
              return {
                dataURL: imagenUrl,
                name: imagen,
                size: 1234 // Puedes reemplazar este valor con el tamaño real si lo deseas
              };
            });


            // Mostrar la imagen en Dropzone
            const imagenUrl = `https://localhost:7091/images/restaurantes/${this.restaurante.rest_ImagenPortada}`;
            this.uploadedFiles = [{
              dataURL: imagenUrl,
              name: this.restaurante.rest_ImagenPortada,
              size: 1234
            }];
          },
          error: (error) => {
            console.error('Error al obtener los datos del restaurante', error);
            Swal.fire('Error', 'No se pudieron cargar los datos del restaurante.', 'error');
          }
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

      obtenerServicios() {
        this.http.get<any[]>('https://localhost:7091/ListarServiciosRestaurante').subscribe({
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
  
      
  
      editarRestaurante() {
        this.submit = true;
      
        if (this.validationform.invalid) {
          alert('Por favor, completa todos los campos obligatorios.');
          return;
        }
      
        const formValues = this.validationform.value;
      
        this.restaurante = {
          rest_Id: this.restaurante.rest_Id, // Asegúrate de tener este valor cargado previamente
          rest_Nombre: formValues.rest_Nombre,
          rest_Descripcion: formValues.rest_Descripcion,
          rest_Direccion: formValues.rest_Direccion,
          muni_Codigo: formValues.muni_Codigo,
          muni_Nombre: '',
          depa_Codigo: '',
          depa_Nombre: '',
          tRes_Id: formValues.tRes_Id,
          rest_ImagenPortada: this.restaurante.rest_ImagenPortada || '',
          tRes_Descripcion: '',
          rest_Telefono: formValues.rest_Telefono,
          rest_tieneWifi: formValues.rest_tieneWifi,
          rest_esPetFriendly: formValues.rest_esPetFriendly,
          rest_CantidadEstrellas: formValues.rest_CantidadEstrellas,
          rest_RangoPrecios: formValues.rest_RangoPrecios,
          rest_FechaModificacion: new Date(), // <- Cambio aquí si tu backend lo espera
          usua_Modificacion: 1, // <- Id del usuario que edita
          usua_Creacion: this.restaurante.usua_Creacion || 0, // <- Id del usuario que crea
          rest_FechaCreacion: this.restaurante.rest_FechaCreacion || new Date(), // <- Fecha de creación original
          servicios: this.serviciosSeleccionados,
          imagenes: this.imagenesSeleccionadas || [],
        };
      
        this.http.post('https://localhost:7091/EditarRestauranteCompleto', this.restaurante).subscribe({
          next: () => {
            this.router.navigate(['/restaurante/restaurantes/list']);
            setTimeout(() => {
              Swal.fire({
                title: 'Restaurante actualizado',
                text: 'El restaurante ha sido editado correctamente',
                icon: 'success',
                confirmButtonText: 'Listo',
              });
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error al editar el restaurante',
              text: 'Ocurrió un error al guardar los cambios. Intenta de nuevo.',
            });
          }
        });
      }
  
        mostrarDatos(): void {
          console.log("Datos a enviar:", this.restaurante);
          console.log("Servicios seleccionados:", this.serviciosSeleccionados);
          console.log("Imágenes seleccionadas:", this.imagenesSeleccionadas);
          alert(`Datos del restaurante:\n${JSON.stringify(this.restaurante, null, 2)}\n\nImágenes:\n${this.imagenesSeleccionadas.join(', ')}`);
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
      url: 'https://localhost:7091/SubirImagenRestaurante',
      clickable: true,
      addRemoveLinks: true,
      previewsContainer: false,
      paramName: 'file',
      maxFilesize: 50,
      acceptedFiles: 'image/*',
    };
  
    public dropzoneGaleriaConfig: DropzoneConfigInterface = {
      url: 'https://localhost:7091/SubirImagenRestaurante',
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
        this.restaurante.rest_ImagenPortada = fileName;
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
