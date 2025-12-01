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
import { Empleado } from 'src/app/models/empleado.model';
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
  @Input() empleado!: Empleado;
  @Output() cancelar = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<void>();

  editForm!: FormGroup;
  submit = false;

  cargos: any[] = [];
  estadosCiviles: any[] = [];
  municipios: any[] = [];


  constructor(private fb: FormBuilder, private http: HttpClient) {}

  cargarCargos() {
    this.http.get<any[]>('https://localhost:7091/ListarCargos')
      .subscribe(data => this.cargos = data);
  }
  
  cargarEstadosCiviles() {
    this.http.get<any[]>('https://localhost:7091/ListarEstadosCiviles')
      .subscribe(data => this.estadosCiviles = data);
  }

  cargarMunicipios() {
    this.http.get<any[]>('https://localhost:7091/ListarMunicipios')
      .subscribe(data => this.municipios = data);
  }
  
  ngOnInit(): void {
    const fechaInicial = new Date(this.empleado.empl_FechaNacimiento).toISOString().split('T')[0];
    this.editForm = this.fb.group({
      empl_Id: [this.empleado.empl_Id],
      empl_Identidad: [this.empleado.empl_Identidad],
      empl_Nombres: [this.empleado.empl_Nombres],
      empl_Apellidos: [this.empleado.empl_Apellidos],
      carg_Id: [this.empleado.carg_Id, Validators.required],
      empl_FechaNacimiento: [fechaInicial],
//    empl_FechaNacimiento: [this.empleado.empl_FechaNacimiento],
      empl_Sexo: [this.empleado.empl_Sexo],
      esCi_Id: [this.empleado.esCi_Id, Validators.required],
      empl_Direccion: [this.empleado.empl_Direccion],
      muni_Codigo: [this.empleado.muni_Codigo, Validators.required],
      empl_Telefono: [this.empleado.empl_Telefono],
      empl_Imagen: [this.empleado.empl_Imagen],
    });
    console.log(this.editForm);
    this.cargarCargos();
    this.cargarEstadosCiviles();
    this.cargarMunicipios();
  }

  editarEmpleado() {
    this.submit = true;
    if (this.editForm.invalid) return;

    const datosActualizados = {
      ...this.empleado,
      ...this.editForm.value
    };

    console.log('Datos que se envían a la API:', datosActualizados);

    this.http.put('https://localhost:7091/ActualizarEmpleado', datosActualizados).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado',
          text: 'El empleado se actualizó correctamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            this.actualizado.emit(); // Esto ya lo tienes configurado en el list para recargar
          }
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar el empleado.', 'error');
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
