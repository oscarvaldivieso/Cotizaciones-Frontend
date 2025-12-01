import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components (Standalone)
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
    {
        path: 'list',
        component: ListComponent
    },
    {
        path: 'create',
        component: CreateComponent
    },
    {
        path: 'report',
        component: ReportComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CotizacionesRoutingModule { }
