import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateServiceComponent } from './create-service/create-service.component';
import { ServicesComponent } from './services/services.component';

const routes: Routes = [
  {
    path:"",
    data: {
      title: 'Services'
    },
    children:[
      {
        path:'all',
        component:ServicesComponent,
        data: {
          title: 'All Services'
        }
      },
      {
        path:"edit/:id",
        component:CreateServiceComponent,
        data: {
          title: 'Update Service'
        }
      },
      {
        path:'create',
        component:CreateServiceComponent,
        data: {
          title: 'Create Service'
        }
      },
      {
        path:'',
        redirectTo:"all"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }
