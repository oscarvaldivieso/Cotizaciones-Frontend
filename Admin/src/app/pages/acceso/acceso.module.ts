import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Page Route

import { AccesoRoutingModule } from './acceso-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AccesoRoutingModule,
    UsuariosModule,
    RolesModule,
    SharedModule,
  ]
})
export class AccesoModule { }
