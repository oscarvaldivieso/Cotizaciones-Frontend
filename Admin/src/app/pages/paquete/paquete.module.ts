
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Page Route
import { PaquetesModule } from './paquetes/paquetes.module';
import { PaqueteRoutingModule } from './paquete-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PaqueteRoutingModule,
    PaquetesModule,
    SharedModule,
  ]
})
export class PaqueteModule { }
