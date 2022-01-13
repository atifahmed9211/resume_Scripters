import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CritiqueRoutingModule } from './critique-routing.module';
import { CritiquesComponent } from './critiques/critiques.component';
import { CritiqueComponent } from './critique/critique.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [CritiquesComponent,CritiqueComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    CritiqueRoutingModule
  ]
})
export class CritiqueModule { }
