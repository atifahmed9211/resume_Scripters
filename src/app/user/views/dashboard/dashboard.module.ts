import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from '@angular/common';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule,
    NgCircleProgressModule.forRoot({
      "renderOnClick":false,
      "radius": 30,
      "space": -5,
      "backgroundPadding":0,
      "outerStrokeGradient": false,
      "outerStrokeWidth": 5,
      "outerStrokeColor": "#00a67d",
      "outerStrokeGradientStopColor": "#53a9ff",
      "innerStrokeColor": "#ffffff",
      "innerStrokeWidth": 5,
      "title": "UI",
      "animateTitle": false,
      "animationDuration": 3000,
      "showTitle": false,
      "showSubtitle": false,
      "showUnits": false,
      "showBackground": true,
      "responsive": true,
      "lazy": true,
    }),
  ],
  declarations: [ DashboardComponent ]
})
export class DashboardModule {
  
 }
