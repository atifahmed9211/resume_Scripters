import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumesSamplesRoutingModule } from './resumes-samples-routing.module';
import { CreateSampleComponent } from './create-sample/create-sample.component';
import { SamplesComponent } from './samples/samples.component';
import { CategoriesComponent } from './categories/categories.component';
import { DataTablesModule } from 'angular-datatables';
import { WebsiteModule } from '../../website/website.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { SamplesDetailComponent } from './samples/samples-detail/samples-detail.component';

@NgModule({
  declarations: [
    CreateSampleComponent,
    SamplesComponent,
    CategoriesComponent,
    SamplesDetailComponent,
  ],
  imports: [
    CommonModule,
    ResumesSamplesRoutingModule,
    DataTablesModule,
    WebsiteModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule
  ]
})
export class ResumesSamplesModule { }
