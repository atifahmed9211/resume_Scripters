import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackageRoutingModule } from './package-routing.module';
import { PackagesComponent } from './packages/packages.component';
import { CreatePackageComponent } from './create-package/create-package.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [PackagesComponent, CreatePackageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    PackageRoutingModule
  ]
})
export class PackageModule { }
