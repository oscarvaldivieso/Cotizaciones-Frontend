import { Component, inject, OnInit } from '@angular/core';
import{CommonModule} from '@angular/common'; //Funciones de angular
import {RouterModule} from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Options } from '@angular-slider/ngx-slider';
import { NgxSliderModule } from 'ngx-slider-v2';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgxSliderModule,
    BsDropdownModule
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

  Paquete: any[] = []; //Arreglo que usaremos para traer lo del endpoint

  ngOnInit(){
    this.listarPaquetes();
  }

  listarPaquetes(): void{
    const loader = document.getElementById('elmLoader');
  
    this.http.get<any[]>('https://localhost:7091/ListarPaquetes').subscribe({
      next: (data) => {
        loader?.classList.add('d-none');
        this.Paquete = data.map(paquete => ({
          ...paquete,
          imagenUrl: `https://localhost:7091/images/paquetes/${paquete.paqt_ImagenPortada}`
        }));
      },
      error: (error) => {
        console.error('Error al obtener empleados:', error);
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

eliminarPaquete(id: number) {
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
          const url = `https://localhost:7091/EliminarPaquete?id=${id}`;
          
          this.http.post(url, null).subscribe({
            next: () => {
              Swal.fire(
                'Eliminado',
                'El paquete ha sido eliminado correctamente.',
                'success'
              );
              this.listarPaquetes(); // <- recarga la lista si tienes una función así
            },
            error: () => {
              Swal.fire(
                'Error',
                'Hubo un problema al eliminar el paquete.',
                'error'
              );
            }
          });
        }
      });
    }

}
