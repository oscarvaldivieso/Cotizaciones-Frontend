import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import{CommonModule} from '@angular/common'; //Funciones de angular
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente.model';
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
  cliente = new Cliente(); //Arreglo que usaremos para traer lo del endpoint
  clienteForm!: FormGroup;

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
  /**
   *
   */
  constructor(private fb:UntypedFormBuilder) {
    
  }

  ngOnInit(): void {
    this.obtenerMunicipios();
    this.obtenerEstadosCiviles();
    
    this.validationform = this.fb.group({
      clie_Identidad: ['', Validators.required], clie_Nombres: ['', Validators.required], clie_Apellidos: ['', Validators.required],
      clie_FechaNacimiento: ['', Validators.required], clie_Sexo: ['', Validators.required], esCi_Id: ['', Validators.required],
      clie_Direccion: ['', Validators.required], clie_Telefono: ['', Validators.required], muni_Codigo: ['', Validators.required]
    })
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

  
  crearCliente() {
    this.submit = true;
    if (this.validationform.invalid) {
       return;
    }

    const formValues = this.validationform.value;
    // const clienteData = this.clienteForm.value;
    // clienteData.usua_Creacion = 1;
    // const fechaCreacion = new Date();
    // clienteData.clie_FechaCreacion = fechaCreacion.toLocaleDateString();

    this.cliente = {
      clie_Id: 0,
      clie_Imagen: '',
      esCi_Nombre: '',
      muni_Nombre: '',
      clie_Identidad: formValues.clie_Identidad,
      clie_Nombres: formValues.clie_Nombres,
      clie_Apellidos: formValues.clie_Apellidos,
      esCi_Id: formValues.esCi_Id,
      clie_FechaNacimiento: formValues.clie_FechaNacimiento,
      clie_Sexo: formValues.clie_Sexo,
      clie_Direccion: formValues.clie_Direccion,
      muni_Codigo: formValues.muni_Codigo,
      clie_Telefono: formValues.clie_Telefono,
      clie_FechaCreacion: new Date(),
      usua_Creacion: 1
    };

    this.cancelar.emit;

    this.http.post('https://localhost:7091/InsertarCliente', this.cliente).subscribe({
      next: () => {
        this.router.navigate(['/general/clientes/list'])
        .then(() => {
          Swal.fire({
            title: 'Cliente insertado',
            text: 'El cliente ha sido insertado correctamente',
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
          title: 'Error al crear el cliente',
          text: 'Ocurrió un error al guardar el cliente. Intenta de nuevo.',
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
//     const control = this.clienteForm.get(campo);
//     return control?.invalid && control?.touched ? true : false;
//   }

// campoInvalido(campo: string): boolean {
//   const control = this.clienteForm.get(campo);
//   return !!(control && control.invalid && control.touched);
// }

campoInvalido(campo: string): boolean {
  return !!this.clienteForm.get(campo)?.invalid && !!this.clienteForm.get(campo)?.touched;
}

}

// interceptor es una clase que uno lo retorna
