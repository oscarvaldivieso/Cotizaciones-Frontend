// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-create',
// //   standalone: true,
// //   imports: [],
// //   templateUrl: './create.component.html',
// //   styleUrl: './create.component.scss'
// // })
// // export class CreateComponent {

// // }

// import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
// import{CommonModule} from '@angular/common'; //Funciones de angular
// import {Router} from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Rol } from 'src/app/models/rol.model';
// import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
// import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
// import { group } from '@angular/animations';
// import Swal from 'sweetalert2'
// import { NgSelectModule } from '@ng-select/ng-select';

// @Component({
//   selector: 'app-create',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     DropzoneModule,
//     ReactiveFormsModule,
//     NgSelectModule
//   ],
//   templateUrl: './create.component.html',    
//   styleUrl: './create.component.scss'
// })

// export class CreateComponent implements OnInit {
//   http = inject(HttpClient);
//   router = inject(Router);
//   rol = new Rol(); //Arreglo que usaremos para traer lo del endpoint
//   rolForm!: FormGroup;

//   @Output() cancelar = new EventEmitter<void>();  
//   cancelarFormulario() {
//     this.cancelar.emit();  
//     // console.log("hola");
//     console.log(this.cancelarFormulario);
//   }

//   validationform!: UntypedFormGroup;
//   tooltipvalidationform!: UntypedFormGroup;
//   submit!: boolean;
//   formsubmit!: boolean;
//   /**
//    *
//    */

//   constructor(private formBuilder: UntypedFormBuilder) { }

//   ngOnInit(): void {

//     this.validationform = this.formBuilder.group({
//       role_Nombre: ['', [Validators.required]],
//     });

    
//   }

//   crearRol() {
//     this.submit = true;
//     if (this.validationform.invalid) {
//        return;
//     }

//     const formValues = this.validationform.value;
//     // const usuarioData = this.usuarioForm.value;
//     // usuarioData.usua_Creacion = 1;
//     // const fechaCreacion = new Date();
//     // usuarioData.usua_FechaCreacion = fechaCreacion.toLocaleDateString();
//     this.rol = {
//       role_Id: 0,
//       role_Nombre: formValues.role_Nombre,
//       role_FechaCreacion: new Date(),
//       usua_Creacion: 1
//     };

//     this.http.post('https://localhost:7091/InsertarRol', this.rol).subscribe({
//       next: () => {
//         this.router.navigate(['/acceso/roles/list'])
//         .then(() => {
//           Swal.fire({
//             title: 'Rol insertado',
//             text: 'El rol ha sido insertado correctamente',
//             icon: 'success',
//             showCancelButton: true,
//             confirmButtonColor: '#green',
//             cancelButtonColor: '#red',
//             confirmButtonText: 'Listo',
//           })
//         });
//       },
//       error: () => {
//         Swal.fire({
//           icon: 'error',
//           title: 'Error al crear el rol',
//           text: 'Ocurrió un error al guardar el rol. Intenta de nuevo.',
//         });
//       }
//     });
//   }

//   get form(){
//     return this.validationform.controls;
//   }

//   public dropzoneConfig: DropzoneConfigInterface = {
//     clickable: true,
//     addRemoveLinks: true,
//     previewsContainer: false,
//   };

//   uploadedFiles: any[] = [];

//   // File Upload
//   imageURL: any;
//   onUploadSuccess(event: any) {
//     setTimeout(() => {
//       this.uploadedFiles.push(event[0]);
//     }, 0);
//   }

//   // File Remove
//   removeFile(event: any) {
//     this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
//   }

// }

// // interceptor es una clase que uno lo retorna


// import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
// import{CommonModule} from '@angular/common'; //Funciones de angular
// import {Router} from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Rol } from 'src/app/models/rol.model';
// import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
// import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
// import { group } from '@angular/animations';
// import Swal from 'sweetalert2'
// import { NgSelectModule } from '@ng-select/ng-select';

// @Component({
//   selector: 'app-create',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     DropzoneModule,
//     ReactiveFormsModule,
//     NgSelectModule
//   ],
//   templateUrl: './create.component.html',    
//   styleUrl: './create.component.scss'
// })


// export class CreateComponent implements OnInit {
//   role_Nombre: string = '';
//   pantallas: any[] = []; // para el TreeView
//   pantallasSeleccionadas_Id: string[] = [];

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.cargarPantallas();
//   }

//   cargarPantallas(): void {
//     this.http.get<any[]>('https://localhost:7091/ListarPantallas') 
//       .subscribe({
//         next: (data) => {
//           this.pantallas = data;
//         },
//         error: (error) => {
//           console.error('Error al cargar pantallas', error);
//         }
//       });
//   }

//   toggleSeleccion(idPantalla: string): void {
//     if (this.pantallasSeleccionadas_Id.includes(idPantalla)) {
//       this.pantallasSeleccionadas_Id = this.pantallasSeleccionadas_Id.filter(id => id !== idPantalla);
//     } else {
//       this.pantallasSeleccionadas_Id.push(idPantalla);
//     }
//   }

//   guardarRol(): void {
//     if (!this.role_Nombre || this.pantallasSeleccionadas_Id.length === 0) {
//       alert('El nombre del rol y las pantallas son obligatorios.');
//       return;
//     }

//     // const payload = {
//     //   role_Nombre: this.roleNombre,
//     //   pantallasSeleccionadas: this.pantallasSeleccionadas.join(',')
//     // };
    
//     const payload = {
//       role_Nombre: this.role_Nombre,
//       usua_Creacion: 1,
//       role_FechaCreacion: new Date(),
//       pantallasSeleccionadas_Id: this.pantallasSeleccionadas_Id.join(',')
//     };
    
//     this.http.post('https://localhost:7091/InsertarRol', payload) // Cambia por tu endpoint real
//       .subscribe({
//         next: (response) => {
//           alert('Rol creado con éxito');
//           // Redirige o limpia
//         },
//         error: (err) => {
//           console.error('Error al crear rol', err);
//         }
//       });
//   }
// }

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { rolPantallas } from 'src/app/models/rolPantallas.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  standalone: true,
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  imports:[
    RouterLink,
    FormsModule,
  ReactiveFormsModule,
CommonModule]

})
export class CreateComponent implements OnInit {
  rolForm!: FormGroup;
  pantallas: any[] = [];
  pantallasSeleccionadas: number[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.rolForm = this.fb.group({
      role_Nombre: ['', Validators.required]
    });

    this.cargarPantallas();
  }

  cargarPantallas(): void {
    this.http.get<any[]>('https://localhost:7091/ListarPantallas')
      .subscribe({
        next: (data) => this.pantallas = data,
        error: (err) => console.error('Error al cargar pantallas', err)
      });
  }

  toggleSeleccion(idPantalla: number): void {
    const index = this.pantallasSeleccionadas.indexOf(idPantalla);
    if (index > -1) {
      this.pantallasSeleccionadas.splice(index, 1);
    } else {
      this.pantallasSeleccionadas.push(idPantalla);
    }
  }
  rolModel = new rolPantallas();
  guardarRol(): void {

    if (this.rolForm.invalid || this.pantallasSeleccionadas.length === 0) {
      Swal.fire('Error', 'Debe completar el nombre y seleccionar al menos una pantalla.', 'error');
      return;
    }


    this.rolModel.role_Nombre = this.rolForm.value.role_Nombre;
 
    this.rolModel.pantIds = this.pantallasSeleccionadas.join(',') ;
   
    this.rolModel.usua_Creacion = 1;
    this.rolModel.role_FechaCreacion =  new Date();
  

    this.http.post('https://localhost:7091/InsertarRol', this.rolModel)
      .subscribe({
        next: () => {
          Swal.fire('Éxito', 'Rol creado correctamente.', 'success')
            .then(() => this.router.navigate(['/acceso/roles/list']));
        },
        error: (err) => {
          console.error('Error al insertar rol', err);
          Swal.fire('Error', 'Ocurrió un error al guardar el rol.', 'error');
        }
      });
  }
}
