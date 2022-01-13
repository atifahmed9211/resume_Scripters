import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePackageComponent } from './create-package/create-package.component';
import { PackagesComponent } from './packages/packages.component';

const routes: Routes = [
  {
    path:"",
    data: {
      title: 'Packages'
    },
    children:[
      {
        path:'all',
        component:PackagesComponent,
        data: {
          title: 'All Packages'
        }
      },
      {
        path:"edit/:id",
        component:CreatePackageComponent,
        data: {
          title: 'Update Package'
        }
      },
      {
        path:'create',
        component:CreatePackageComponent,
        data: {
          title: 'Create Package'
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
export class PackageRoutingModule { }
