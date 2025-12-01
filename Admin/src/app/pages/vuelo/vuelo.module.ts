
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Page Route
import { VuelosModule } from './vuelos/vuelos.module';
import { VueloRoutingModule } from './vuelo-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    VuelosModule,
    VueloRoutingModule,
    SharedModule,
  ]
})
export class VueloModule { }
