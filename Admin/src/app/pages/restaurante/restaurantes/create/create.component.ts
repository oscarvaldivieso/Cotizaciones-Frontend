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
import { Restaurante } from 'src/app/models/restaurante.model';
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
  
    constructor(private formBuilder: UntypedFormBuilder) { }
  
    ngOnInit(): void {
      this.obtenerMunicipios();
      this.obtenerTiposRestaurantes();
      this.obtenerServicios();
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

    

    crearRestaurante() {
        this.submit = true;
        // Verifica si el formulario es válido
        if (this.validationform.invalid) {
          alert('Por favor, completa todos los campos obligatorios.');
          return;
        }
      
        // Asigna los valores del formulario al modelo empleado
        const formValues = this.validationform.value;
      
        this.restaurante = {
          rest_Id: 0,
          rest_Nombre: formValues.rest_Nombre,
          rest_Descripcion:formValues.rest_Descripcion,     
          rest_Direccion:formValues.rest_Direccion,     
          muni_Codigo: formValues.muni_Codigo,
          muni_Nombre: '',
          depa_Codigo: '',
          depa_Nombre:'',
          tRes_Id: formValues.tRes_Id,
          rest_ImagenPortada: this.restaurante.rest_ImagenPortada || '',
          tRes_Descripcion: '',
          rest_Telefono: formValues.rest_Telefono,
          rest_tieneWifi: formValues.rest_tieneWifi,
          rest_esPetFriendly: formValues.rest_esPetFriendly,
          rest_CantidadEstrellas: formValues.rest_CantidadEstrellas,
          rest_RangoPrecios: formValues.rest_RangoPrecios,
          rest_FechaCreacion: new Date(),
          usua_Creacion: 1,
          usua_Modificacion: 0,
          rest_FechaModificacion: new Date(),
          servicios: this.serviciosSeleccionados,
          imagenes: this.imagenesSeleccionadas || [],
        };

        this.mostrarDatos();


        this.http.post('https://localhost:7091/InsertarRestauranteCompleto', this.restaurante).subscribe({
          next: () => {
            this.router.navigate(['/restaurante/restaurantes/list']);
            setTimeout(()=>{
              Swal.fire({
                title: 'Restaurante insertado',
                text: 'El restaurante ha sido insertado correctamente',
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
              title: 'Error al crear el restaurante',
              text: 'Ocurrió un error al guardar el restaurante. Intenta de nuevo.',
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

  removeFileGaleria(event: any) {
    this.uploadedFilesGaleria.splice(this.uploadedFilesGaleria.indexOf(event), 1);
  }

}
