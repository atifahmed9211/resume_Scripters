import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { CreateServiceComponent } from './create-service/create-service.component';
import { ServicesComponent } from './services/services.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from "angular-datatables";


@NgModule({
  declarations: [CreateServiceComponent, ServicesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ServiceRoutingModule
  ]
})
export class ServiceModule { }
