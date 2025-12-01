import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import{CommonModule} from '@angular/common'; //Funciones de angular
import {RouterModule} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CreateComponent } from '../create/create.component';
import { trigger, state, style, animate, transition} from '@angular/animations';
import Swal from 'sweetalert2'; 
import { EditComponent } from '../../clientes/edit/edit.component';

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

  Cliente: any[] = []; //Arreglo que usaremos para traer lo del endpoint

  showCreate = false;
  showEdit = false;

  toggleCreate(): void {
    this.showCreate = !this.showCreate;
  }

  cancelCreate(): void {
    this.showCreate = false;
    this.ngOnInit();
  }

  

  listarClientes(): void{
    const loader = document.getElementById('elmLoader');
    this.http.get<any[]>('https://localhost:7091/ListarClientes').subscribe({
      next: (data) => {
        this.Cliente = data;
        loader?.classList.add('d-none'); // Oculta el loader cuando los datos llegan
      },
      error: (err) => {
        console.error('Error al obtener clientes:', err);
        loader?.classList.add('d-none'); // También ocúltalo si hay error
      }
    });
  }
  
  ngOnInit() {
    this.listarClientes();
    
  }

  obtenerClientes() {
    fetch('https://localhost:7091/ListarClientes')
      .then(res => res.json())
      .then(data => {
        this.Cliente = data;
      });
  }

  // Editar

clienteSeleccionado: any;

editarCliente(cliente: any) {
  this.clienteSeleccionado = cliente;
  this.showEdit = true;
  this.showCreate = false; // Por si querés cerrar el "create" cuando se edita
}

cancelEdit() {
  this.showEdit = false;
}

recargarLista() {
  //this.obtenerTours(); // O tu método para refrescar la lista
  this.showEdit = false; // Cierra el panel de edición
  this.listarClientes();    // Refresca la lista
}

  eliminarCliente(clienteId: number) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el cliente seleccionado',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          fetch('https://localhost:7091/EliminarCliente', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clie_Id: clienteId }) // 👈 ¡Aquí envías el ID!
          })
          .then(response => {
            if (response.ok) {
              Swal.fire('¡Eliminado!', 'El cliente fue eliminado con éxito.', 'success');
              this.obtenerClientes(); // Refresca la tabla
            } else {
              Swal.fire('Error', 'No se pudo eliminar el cliente.', 'error');
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
