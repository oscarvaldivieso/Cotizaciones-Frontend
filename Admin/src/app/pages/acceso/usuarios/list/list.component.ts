import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import{CommonModule} from '@angular/common'; //Funciones de angular
import {RouterModule} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CreateComponent } from '../create/create.component';
import Swal from 'sweetalert2'; 
import { EditComponent } from 'src/app/pages/acceso/usuarios/edit/edit.component';

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
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit{
  http = inject(HttpClient);

  Usuario: any[] = []; //Arreglo que usaremos para traer lo del endpoint

  showCreate = false;
  showEdit = false;

  toggleCreate(): void {
    this.showCreate = !this.showCreate;
  }

  cancelCreate(): void {
    this.showCreate = false;
    this.ngOnInit();
  }

  listarUsuarios(): void{
    const loader = document.getElementById('elmLoader');
    this.http.get<any[]>('https://localhost:7091/ListarUsuarios').subscribe({
      next: (data) => {
        this.Usuario = data;
        loader?.classList.add('d-none'); // Oculta el loader cuando los datos llegan
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        loader?.classList.add('d-none'); // También ocúltalo si hay error
      }
    });
  }
  
  ngOnInit() {
    this.listarUsuarios();
  }

  obtenerUsuarios() {
    fetch('https://localhost:7091/ListarUsuarios')
      .then(res => res.json())
      .then(data => {
        this.Usuario = data;
      });
  }

  // Editar

usuarioSeleccionado: any;

editarUsuario(tour: any) {
  this.usuarioSeleccionado = tour;
  this.showEdit = true;
  this.showCreate = false; // Por si querés cerrar el "create" cuando se edita
}

cancelEdit() {
  this.showEdit = false;
  this.obtenerUsuarios(); // o el método que actualiza la lista
}

recargarLista() {
  //this.obtenerTours(); // O tu método para refrescar la lista
  this.showEdit = false; // Cierra el panel de edición
  this.obtenerUsuarios();    // Refresca la lista
}


  // ELIMINAR
  estadoUsuario(usuarioId: number) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción desactivará el usuario seleccionado',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          fetch('https://localhost:7091/InactivarUsuario', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usua_Id: usuarioId }) // 👈 ¡Aquí envías el ID!
          })
          .then(response => {
            if (response.ok) {
              Swal.fire('¡Desactivado!', 'El usuario fue desactivado con éxito.', 'success');
              this.obtenerUsuarios(); // Refresca la tabla
            } else {
              Swal.fire('Error', 'No se pudo desactivar el usuario.', 'error');
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
