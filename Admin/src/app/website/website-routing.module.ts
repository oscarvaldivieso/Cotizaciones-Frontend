import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HorizontalComponent } from '../layouts/horizontal/horizontal.component';
import { HomeComponent } from './pages/home/home.component';
import { RestaurantesComponent } from './pages/restaurantes/restaurantes.component';
import { VuelosComponent } from './pages/vuelos/vuelos.component';
import { WebsiteLayoutComponent } from './website-layout/website-layout.component';
import { PaquetesModule } from './pages/paquetes/paquetes.module';

const routes: Routes = [
  {
    path: '',
    component: WebsiteLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      {
        path: 'paquetes', loadChildren: () => import('./pages/paquetes/paquetes.module').then(m => m.PaquetesModule)
      }
      // más rutas aquí
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule {}



