import { Component, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { Habitacion } from 'src/app/models/habitacion.model';   

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  http = inject(HttpClient);
  router = inject(Router);
  habitacion = new Habitacion();

    crearHabitacion() {
      this.habitacion.usua_Creacion = 1;
      const fecha = new Date();
      fecha.toLocaleDateString;
      this.habitacion.habt_FechaCreacion = fecha;


      this.http.post('https://localhost:7091/InsertarHabitacion', this.habitacion).subscribe( () => {
        alert("La habitación se creó con éxito" + this.habitacion.habt_PrecioNoche);

        this.router.navigate(['/']);
      });
    }
}
