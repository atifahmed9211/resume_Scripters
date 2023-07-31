import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { CreateServiceComponent } from './create-service/create-service.component';
import { ServicesComponent } from './services/services.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from "angular-datatables";
import { WebsiteModule } from '../../website/website.module';

@NgModule({
  declarations: [CreateServiceComponent, ServicesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ServiceRoutingModule,
    WebsiteModule
  ]
})
export class ServiceModule { }
