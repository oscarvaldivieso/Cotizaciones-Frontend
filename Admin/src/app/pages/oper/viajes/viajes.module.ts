import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';


// Shared
import { SharedModule } from 'src/app/shared/shared.module';

// Bootstrap modules
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';

// Componentes
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { DetailsComponent } from './details/details.component';
import { ListComponent } from './list/list.component';

// Otros módulos
import { NgSelectModule } from '@ng-select/ng-select';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ViajesRoutingModule } from './viajes-routing.module';

@NgModule({
    imports: [
        // Standalone components
        CreateComponent,
        EditComponent,
        DetailsComponent,
        ListComponent,

        // Modules
        ViajesRoutingModule,
        CommonModule,
        ToastrModule.forRoot(),
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
export class ViajesModule { }
