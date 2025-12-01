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
import { Cliente } from 'src/app/models/cliente.model';
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
  @Input() cliente!: Cliente;
  @Output() cancelar = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<void>();

  editForm!: FormGroup;
  submit = false;

  estadosCiviles: any[] = [];
  municipios: any[] = [];


  constructor(private fb: FormBuilder, private http: HttpClient) {}

  cargarEstadosCiviles() {
    this.http.get<any[]>('https://localhost:7091/ListarEstadosCiviles')
      .subscribe(data => this.estadosCiviles = data);
  }
  
  cargarMunicipios() {
    this.http.get<any[]>('https://localhost:7091/ListarMunicipios')
      .subscribe(data => this.municipios = data);
  }
  
  ngOnInit(): void {
    this.editForm = this.fb.group({
      clie_Id: [this.cliente.clie_Id],
      clie_Identidad: [this.cliente.clie_Identidad],
      clie_Nombres: [this.cliente.clie_Nombres],
      clie_Apellidos: [this.cliente.clie_Apellidos],
      clie_FechaNacimiento: [this.cliente.clie_FechaNacimiento],
      clie_Sexo: [this.cliente.clie_Sexo],
      esCi_Id: [+this.cliente.esCi_Id, Validators.required],
      clie_Direccion: [this.cliente.clie_Direccion],
      muni_Codigo: [this.cliente.muni_Codigo, Validators.required],
      clie_Telefono: [this.cliente.clie_Telefono],
      clie_Imagen: [this.cliente.clie_Imagen],
    });

    this.cargarEstadosCiviles();
    this.cargarMunicipios();
  }

  editarCliente() {
    this.submit = true;
    if (this.editForm.invalid) return;

    const datosActualizados = {
      ...this.cliente,
      ...this.editForm.value
    };

    this.http.put('https://localhost:7091/ActualizarCliente', datosActualizados).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado',
          text: 'El cliente se actualizó correctamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            this.actualizado.emit(); // Esto ya lo tienes configurado en el list para recargar
          }
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar el cliente.', 'error');
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

