import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import{CommonModule} from '@angular/common'; //Funciones de angular
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { group } from '@angular/animations';
import Swal from 'sweetalert2'
import { NgSelectModule } from '@ng-select/ng-select';

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
  usuario = new Usuario(); //Arreglo que usaremos para traer lo del endpoint
  usuarioForm!: FormGroup;
  empleados: any[] = [];
  roles: any[] = [];

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

  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {

    this.obtenerEmpleados();
    this.obtenerRoles();

    this.validationform = this.formBuilder.group({
      usua_Nombre: ['', [Validators.required]],
      usua_Contrasena: ['', [Validators.required]],
      empl_Id: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      role_Id: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]]
    });

    
  }

  obtenerEmpleados() {
    this.http.get<any[]>('https://localhost:7091/ListarNombresEmpleados').subscribe({
      next: (data) => {
        this.empleados = data;
      },
      error: (error) => {
        console.error('Error al obtener empleados:', error);
      }
    });
  }
  obtenerRoles() {
    this.http.get<any[]>('https://localhost:7091/ListarRoles').subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (error) => {
        console.error('Error al obtener roles:', error);
      }
    });
  }

  crearUsuario() {
    this.submit = true;
    if (this.validationform.invalid) {
       return;
    }

    const formValues = this.validationform.value;
    // const usuarioData = this.usuarioForm.value;
    // usuarioData.usua_Creacion = 1;
    // const fechaCreacion = new Date();
    // usuarioData.usua_FechaCreacion = fechaCreacion.toLocaleDateString();
    this.usuario = {
      usua_Id: 0,
      usua_Nombre: formValues.usua_Nombre,
      usua_Contrasena: formValues.usua_Contrasena,
      usua_Imagen: '',
      nombreCompleto: '',
      role_Nombre: '',
      empl_Id: formValues.empl_Id,
      role_Id: formValues.role_Id,  
      usua_Estado: 1, 
      usua_FechaCreacion: new Date(),
      usua_Creacion: 1
    };

    this.http.post('https://localhost:7091/InsertarUsuario', this.usuario).subscribe({
      next: () => {
        this.router.navigate(['/acceso/usuarios/list'])
        .then(() => {
          Swal.fire({
            title: 'Usuario insertado',
            text: 'El usuario ha sido insertado correctamente',
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
          title: 'Error al crear el usuario',
          text: 'Ocurrió un error al guardar el usuario. Intenta de nuevo.',
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
//     const control = this.usuarioForm.get(campo);
//     return control?.invalid && control?.touched ? true : false;
//   }

// campoInvalido(campo: string): boolean {
//   const control = this.usuarioForm.get(campo);
//   return !!(control && control.invalid && control.touched);
// }

campoInvalido(campo: string): boolean {
  return !!this.usuarioForm.get(campo)?.invalid && !!this.usuarioForm.get(campo)?.touched;
}

}

// interceptor es una clase que uno lo retorna
