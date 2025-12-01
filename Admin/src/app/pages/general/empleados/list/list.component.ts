import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import{CommonModule} from '@angular/common'; //Funciones de angular
import {RouterModule} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { trigger, state, style, animate, transition} from '@angular/animations';
import Swal from 'sweetalert2'; 


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CreateComponent,
    EditComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  animations: [
    trigger('collapse', [
      state('void', style({ height: '0px', opacity: 0 })),
      state('', style({ height: '', opacity: 1 })),
      transition(':enter', [
        style({ height: '0px', opacity: 0 }),
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: '0px', opacity: 0 }))
      ])
    ])
  ]
})
export class ListComponent implements OnInit{
  http = inject(HttpClient);
  showCreate = false;
  showEdit = false;

  Empleado: any[] = []; //Arreglo que usaremos para traer lo del endpoint

  toggleCreate(): void {
    this.showCreate = !this.showCreate;
  }

  cancelCreate(): void {
    this.showCreate = false;
    this.ngOnInit();
  }

  listarEmpleados(): void{
    const loader = document.getElementById('elmLoader');
  
    this.http.get<any[]>('https://localhost:7091/ListarEmpleados').subscribe({
      next: (data) => {
        this.Empleado = data.map(empleado => ({
          ...empleado,
          imagenUrl: `https://localhost:7091/images/empleados/${empleado.empl_Imagen}`
        }));
      },
      error: (error) => {
        console.error('Error al obtener empleados:', error);
      }
    });
  }
  ngOnInit() {
    this.listarEmpleados();
  }

  obtenerEmpleados() {
    fetch('https://localhost:7091/ListarEmpleados')
      .then(res => res.json())
      .then(data => {
        this.Empleado = data;
      });
  }

  empleadoSeleccionado: any;

editarEmpleado(empleado: any) {
  // console.log(empleado);
  this.empleadoSeleccionado = empleado;
  this.showEdit = true;
  this.showCreate = false; // Por si querés cerrar el "create" cuando se edita
}

cancelEdit() {
  this.showEdit = false;
}

recargarLista() {
  this.obtenerEmpleados(); // O tu método para refrescar la lista
  this.showEdit = false; // Cierra el panel de edición
  this.listarEmpleados();    // Refresca la lista
}

  // ELIMINAR
  eliminarEmpleado(empleadoId: number) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el empleado seleccionado',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          fetch('https://localhost:7091/EliminarEmpleado', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ empl_Id: empleadoId }) // 👈 ¡Aquí envías el ID!
          })
          .then(response => {
            if (response.ok) {
              Swal.fire('¡Eliminado!', 'El empleado fue eliminado con éxito.', 'success');
              this.obtenerEmpleados(); // Refresca la tabla
            } else {
              Swal.fire('Error', 'No se pudo eliminar el empleado.', 'error');
            }
          })
          .catch(error => {
            console.error('Error en la eliminación:', error);
            Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
          });
        }
      });
    }
}
