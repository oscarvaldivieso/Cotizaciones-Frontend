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
import { Tour } from 'src/app/models/tour.model';
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
  @Input() tour!: Tour;
  @Output() cancelar = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<void>();

  editForm!: FormGroup;
  submit = false;

  actividades: any[] = [];
  municipios: any[] = [];


  constructor(private fb: FormBuilder, private http: HttpClient) {}

  cargarActividades() {
    this.http.get<any[]>('https://localhost:7091/ListarActividades')
      .subscribe(data => this.actividades = data);
  }
  
  cargarMunicipios() {
    this.http.get<any[]>('https://localhost:7091/ListarMunicipios')
      .subscribe(data => this.municipios = data);
  }
  
  ngOnInit(): void {
    this.editForm = this.fb.group({
      tour_Id: [this.tour.tour_Id],
      acti_Id: [this.tour.acti_Id, Validators.required],
      tour_Direccion: [this.tour.tour_Direccion, Validators.required],
      muni_Codigo: [this.tour.muni_Codigo, Validators.required],
    });

    this.cargarActividades();
    this.cargarMunicipios();
  }

  editarTour() {
    this.submit = true;
    if (this.editForm.invalid) return;

    const datosActualizados = {
      ...this.tour,
      ...this.editForm.value
    };

    console.log('Datos que se envían a la API:', datosActualizados);

    this.http.put('https://localhost:7091/ActualizarTour', datosActualizados).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado',
          text: 'El tour se actualizó correctamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            this.actualizado.emit(); // Esto ya lo tienes configurado en el list para recargar
          }
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar el tour.', 'error');
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
