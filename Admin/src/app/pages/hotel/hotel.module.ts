
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Page Route
import { HotelesModule } from './hoteles/hoteles.module';
import { HabitacionesModule } from './habitaciones/habitaciones.module';
import { HotelRoutingModule } from './hotel-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HotelRoutingModule,
    HotelesModule,
    HabitacionesModule,
    SharedModule,
  ]
})
export class HotelModule { }
