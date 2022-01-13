import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CritiqueComponent } from './critique/critique.component';
import { CritiquesComponent } from './critiques/critiques.component';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CritiqueRoutingModule { }
