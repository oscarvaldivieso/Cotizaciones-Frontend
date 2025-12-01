
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Page Route
import { RestaurantesModule } from './restaurantes/restaurantes.module';
import { RestauranteRoutingModule } from './restaurante-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
//Wizard
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RestauranteRoutingModule,
    RestaurantesModule,
    SharedModule,
    CdkStepperModule,
    NgStepperModule
  ]
})
export class RestauranteModule { }
