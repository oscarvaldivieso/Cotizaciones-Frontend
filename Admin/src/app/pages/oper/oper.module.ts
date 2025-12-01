import { ViajesModule } from './viajes/viajes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Page Route
import { OperRoutingModule } from './oper-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        OperRoutingModule,
        ViajesModule,
        SharedModule
    ]
})
export class OperModule { }
