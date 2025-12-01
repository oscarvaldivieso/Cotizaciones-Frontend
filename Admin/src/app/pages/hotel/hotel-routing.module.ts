import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'hoteles', loadChildren: () => import('./hoteles/hoteles.module').then(m => m.HotelesModule)
  },
  {
    path: 'habitaciones', loadChildren: () => import('./habitaciones/habitaciones.module').then(m => m.HabitacionesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelRoutingModule { }
