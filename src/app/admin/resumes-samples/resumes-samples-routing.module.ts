import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { CreateSampleComponent } from './create-sample/create-sample.component';
import { SamplesComponent } from './samples/samples.component';
import { SamplesDetailComponent } from './samples/samples-detail/samples-detail.component';

const routes: Routes = [
  {
    path: "",
    data: {
      title: 'Samples'
    },
    children: [
      {
        path: 'categories_list',
        component: CategoriesComponent,
        data: {
          title: 'All Categories'
        }
      },
      {
        path: 'samples_list',
        component: SamplesComponent,
        data: {
          title: 'All Samples'
        },
      },
      {
        path: 'samples-detail/:id',
        component: SamplesDetailComponent
      },
      {
        path: 'add_new_samples',
        component: CreateSampleComponent,
        data: {
          title: 'add_new_samples'
        }
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ResumesSamplesRoutingModule {

}
