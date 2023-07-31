import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CritiqueRoutingModule } from './critique-routing.module';
import { CritiquesComponent } from './critiques/critiques.component';
import { CritiqueComponent } from './critique/critique.component';
import { DataTablesModule } from 'angular-datatables';
import { ResumeBarrasComponent } from './critique/resume-barras/resume-barras.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { WebsiteModule } from '../../website/website.module';

@NgModule({
  declarations: [CritiquesComponent,CritiqueComponent, ResumeBarrasComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    CritiqueRoutingModule,
    NgCircleProgressModule.forRoot({
      "radius":160,
      "space":-10,
      "renderOnClick":false,
      "outerStrokeWidth":10,
      "outerStrokeGradient": false,
      "outerStrokeGradientStopColor": "#53a9ff",
      "innerStrokeWidth":10,
      "innerStrokeColor": "#e7e8ea",
      "title": "UI",
      "animation":false,
      "animateTitle": false,
      "animationDuration": 3000,
      "showTitle": false,
      "showSubtitle": false,
      "showUnits": false,
      "showBackground": true,
      "responsive": true,
      "lazy":false,
    }),
    WebsiteModule
  ]
})
export class CritiqueModule { }
