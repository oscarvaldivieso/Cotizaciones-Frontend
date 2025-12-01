import { EmpleadosModule } from './empleados/empleados.module';
import { ClientesModule } from './clientes/clientes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToursModule } from './tours/tours.module';
// Page Route
import { GeneralRoutingModule } from './general-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    EmpleadosModule,
    ClientesModule,
    ToursModule,
    SharedModule,
  ]
})
export class GeneralModule { }
