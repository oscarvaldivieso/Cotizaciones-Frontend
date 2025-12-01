import { Component, inject, NgModule, OnInit } from '@angular/core';
import{CommonModule} from '@angular/common'; //Funciones de angular
import {RouterModule} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider';
import { NgxSliderModule } from 'ngx-slider-v2';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RatingModule } from 'ngx-bootstrap/rating';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    RatingModule,
    RouterModule,
    NgxSliderModule,
    BsDropdownModule,
    FormsModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit{
    // Price Slider
    pricevalue: number = 100;
    minValue = 500;
    maxValue = 3800;
    options: Options = {
      floor: 0,
      ceil: 5000,
      translate: (value: number): string => {
        return '$' + value;
      },
    };



  http = inject(HttpClient);

  Hotel: any[] = []; //Arreglo que usaremos para traer lo del endpoint

  ngOnInit(){
    this.listarHoteles();
  }

  listarHoteles(): void{
    const loader = document.getElementById('elmLoader');
  
    this.http.get<any[]>('https://localhost:7091/ListarHoteles').subscribe({
      next: (data) => {
        loader?.classList.add('d-none');
        this.Hotel = data.map(hotel => ({
          ...hotel,
          imagenUrl: `https://localhost:7091/images/hoteles/${hotel.hote_ImagenPortada}`
        }));
      },
      error: (error) => {
        console.error('Error al obtener empleados:', error);
      }
    });
  }

  eliminarHotel(id: number) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: 'gray',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const url = `https://localhost:7091/EliminarHotel?id=${id}`;
          
          this.http.post(url, null).subscribe({
            next: () => {
              Swal.fire(
                'Eliminado',
                'El hotel ha sido eliminado correctamente.',
                'success'
              );
              this.listarHoteles(); // <- recarga la lista si tienes una función así
            },
            error: () => {
              Swal.fire(
                'Error',
                'Hubo un problema al eliminar el vuelo.',
                'error'
              );
            }
          });
        }
      });
    }

  showFilter() {
    const filterStyle = (document.getElementById("propertyFilters") as HTMLElement).style.display;
    if (filterStyle == 'none') {
      (document.getElementById("propertyFilters") as HTMLElement).style.display = 'block'
    } else {
      (document.getElementById("propertyFilters") as HTMLElement).style.display = 'none'
    }
  }
}
