import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Routing
import { CotizacionesRoutingModule } from './cotizaciones-routing.module';

// Shared
import { SharedModule } from 'src/app/shared/shared.module';

// Bootstrap modules
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';

// Otros módulos
import { NgSelectModule } from '@ng-select/ng-select';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FlatpickrModule } from 'angularx-flatpickr';

import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { ReportComponent } from './report/report.component';

@NgModule({
    imports: [
        // Standalone components
        ListComponent,
        CreateComponent,
        ReportComponent,
        // Modules
        CommonModule,
        CotizacionesRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule.forRoot(),
        PaginationModule.forRoot(),
        ModalModule.forRoot(),
        AccordionModule.forRoot(),
        TabsModule.forRoot(),
        SimplebarAngularModule,
        NgSelectModule,
        FlatpickrModule.forRoot()
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CotizacionesModule { }
