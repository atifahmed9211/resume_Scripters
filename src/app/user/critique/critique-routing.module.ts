import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CritiqueComponent } from './critique/critique.component';
import { CritiquesComponent } from './critiques/critiques.component';
import { ResumeServicesComponent } from '../../website/resume-services/resume-services.component';

const routes: Routes = [
  {
    path:"",
    data:{
      title:"Critiques"
    },
    children:[
      {
        path:"all",
        component:CritiquesComponent,
        data:{
          title:"All Critiques"
        }
      },
      {
        path:"critique/:id",
        component:CritiqueComponent,
        data:{
          title:"Critique Detail"
        }
      },
      {
        path:"",
        redirectTo:"all",
        pathMatch:"full"
      },
      {
        path: 'Resume-service',
        component: ResumeServicesComponent,
        data:{data:"Resume-service"}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CritiqueRoutingModule { }
