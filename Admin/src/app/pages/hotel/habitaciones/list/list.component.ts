import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import {CommonModule} from '@angular/common'; //Funciones de angular
import {RouterModule} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CreateComponent } from '../create/create.component';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CreateComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit{
  http = inject(HttpClient);

  Habitacion: any[] = []; //Arreglo que usaremos para traer lo del endpoint

  showCreate = false;
  showEdit = false;

  toggleCreate(): void {
    this.showCreate = !this.showCreate;
  }

  cancelCreate(): void {
    this.showCreate = false;
    this.ngOnInit();
  }

  listarHabitaciones(): void{
    const loader = document.getElementById('elmLoader');
    this.http.get<any[]>('https://localhost:7091/ListarHabitaciones').subscribe({
      next: (data) => {
        this.Habitacion = data;
        loader?.classList.add('d-none'); // Oculta el loader cuando los datos llegan
      },
      error: (err) => {
        console.error('Error al obtener habitaciones:', err);
        loader?.classList.add('d-none'); // También ocúltalo si hay error
      }
    });
  }
  
  ngOnInit() {
    this.listarHabitaciones();
  }
}
