import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'empleados', loadChildren: () => import('./empleados/empleados.module').then(m => m.EmpleadosModule)
  },
  {
    path: 'clientes', loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule)
  },
  {
    path: 'tours', loadChildren: () => import('./tours/tours.module').then(m => m.ToursModule)
  },
  {
    path: 'sucursales', loadChildren: () => import('./sucursales/sucursales.module').then(m => m.SucursalesModule)
  },
  {
    path: 'colaboradores', loadChildren: () => import('./colaboradores/colaboradores.module').then(m => m.ColaboradoresModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
