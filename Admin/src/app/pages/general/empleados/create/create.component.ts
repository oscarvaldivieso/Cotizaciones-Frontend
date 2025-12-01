import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import{CommonModule} from '@angular/common'; //Funciones de angular
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Empleado } from 'src/app/models/empleado.model';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';

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

export class CreateComponent {
  http = inject(HttpClient);
  router = inject(Router);
  empleado = new Empleado(); //Arreglo que usaremos para traer lo del endpoint
  cargos: any[] = [];
  estadosCiviles: any[] = [];
  municipios: any[] = [];

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

  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.obtenerCargos();
    this.obtenerMunicipios();
    this.obtenerEstadosCiviles();
    
    this.validationform = this.formBuilder.group({
      empl_Identidad: ['', [Validators.required]],
      empl_Nombres: ['', [Validators.required]],
      empl_Apellidos: ['', [Validators.required]],
      carg_Id: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      esCi_Id: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      empl_FechaNacimiento: ['', [Validators.required]],
      empl_Sexo: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      empl_Direccion: ['', [Validators.required]],
      muni_Codigo: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      empl_Telefono: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]]
    });

    
  }

  obtenerCargos() {
    this.http.get<any[]>('https://localhost:7091/ListarCargos').subscribe({
      next: (data) => {
        this.cargos = data;
      },
      error: (error) => {
        console.error('Error al obtener cargos:', error);
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

  obtenerEstadosCiviles() {
    this.http.get<any[]>('https://localhost:7091/ListarEstadosCiviles').subscribe({
      next: (data) => {
        this.estadosCiviles = data;
      },
      error: (error) => {
        console.error('Error al obtener estados civiles:', error);
      }
    });
  }


  crearEmpleado() {
    this.submit = true;
    // Verifica si el formulario es válido
    if (this.validationform.invalid) {
      return;
    }
  
    // Asigna los valores del formulario al modelo empleado
    const formValues = this.validationform.value;
  
    this.empleado = {
      empl_Id: 0,
      empl_Imagen: this.empleado.empl_Imagen || '',
      esCi_Nombre:'',
      muni_Nombre: '',
      carg_Descripcion:'',      
      empl_Identidad: formValues.empl_Identidad,
      empl_Nombres: formValues.empl_Nombres,
      empl_Apellidos: formValues.empl_Apellidos,
      carg_Id: formValues.carg_Id,
      esCi_Id: formValues.esCi_Id,
      empl_FechaNacimiento: formValues.empl_FechaNacimiento,
      empl_Sexo: formValues.empl_Sexo,
      empl_Direccion: formValues.empl_Direccion,
      muni_Codigo: formValues.muni_Codigo,
      empl_Telefono: formValues.empl_Telefono,
      empl_FechaCreacion: new Date(),
      usua_Creacion: 1
    };
  
    this.http.post('https://localhost:7091/InsertarEmpleado', this.empleado).subscribe({
      next: () => {
        this.cancelarFormulario();
        setTimeout(()=>{
          Swal.fire({
            title: 'Empleado insertado',
            text: 'El empleado ha sido insertado correctamente',
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
          title: 'Error al crear el empleado',
          text: 'Ocurrió un error al guardar el empleado. Intenta de nuevo.',
        });
      }
    });
  }

  get form() {
    return this.validationform.controls;
  }



  public dropzoneConfig: DropzoneConfigInterface = {
    url: 'https://localhost:7091/SubirImagen',
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
    paramName: 'file',
    maxFilesize: 50,
    acceptedFiles: 'image/*',
  };

  uploadedFiles: any[] = [];

  // File Upload
  imageURL: any;
  onUploadSuccess(event: any) {
  const response = event[1]; // event[1] contiene la respuesta del servidor
  const fileName = response.fileName;
  this.empleado.empl_Imagen = fileName;
  this.uploadedFiles.push({
    ...event[0],
    dataURL: URL.createObjectURL(event[0]),
    name: fileName
  });
}

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }
}
