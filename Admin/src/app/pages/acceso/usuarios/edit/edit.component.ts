// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-edit',
//   standalone: true,
//   imports: [],
//   templateUrl: './edit.component.html',
//   styleUrl: './edit.component.scss'
// })
// export class EditComponent {

// }

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/models/usuario.model';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  @Input() usuario!: Usuario;
  @Output() cancelar = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<void>();

  editForm!: FormGroup;
  submit = false;

  roles: any[] = [];
  empleados: any[] = [];
  estados: any[] = [{
    id: true,
    nombre: 'Activo'
  }, {
    id: false,
    nombre: 'Inactivo'
  }];


  constructor(private fb: FormBuilder, private http: HttpClient) {}

  cargarRoles() {
    this.http.get<any[]>('https://localhost:7091/ListarRoles')
      .subscribe(data => this.roles = data);
  }
  
  cargarEmpleados() {
    this.http.get<any[]>('https://localhost:7091/ListarNombresEmpleados')
      .subscribe(data => this.empleados = data);
  }
  
  ngOnInit(): void {
    this.editForm = this.fb.group({
        usua_Id: [this.usuario.usua_Id],
        usua_Nombre: ['', [Validators.required]],
        usua_Contrasena: ['', [Validators.required]],
        empl_Id: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
        role_Id: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
        usua_Estado: [false, [Validators.required]],
    });

    this.cargarRoles();
    this.cargarEmpleados();

    if (this.usuario) {
    this.editForm.patchValue(this.usuario);
    }
    console.log(this.usuario);
  }
  
  editarUsuario() {
    this.submit = true;
    if (this.editForm.invalid) return;

    const datosActualizados = this.editForm.value;


    console.log('Datos que se envían a la API:', datosActualizados);

    this.http.put('https://localhost:7091/ActualizarUsuario', datosActualizados).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado',
          text: 'El usuario se actualizó correctamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            this.actualizado.emit(); // Esto ya lo tienes configurado en el list para recargar
          }
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
      }
    });
  }

  cancelEdit() {
    this.cancelar.emit();
  }

  get form() {
    return this.editForm.controls;
  }
}