import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './views/login/login.component'
import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TransactionComponent } from './transaction/transaction.component';
import { TransactionDetailComponent } from './transaction/transaction-detail/transaction-detail.component';
//import { NotificationComponent } from './notification/notification.component';
import { DataTablesModule } from 'angular-datatables';
import { WebsiteModule } from '../website/website.module';

@NgModule({
  declarations: [AdminComponent,LoginComponent, TransactionComponent, TransactionDetailComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    TabsModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    WebsiteModule
  ],
  providers: [
    IconSetService,
  ],
  exports:[
  ]
})
export class AdminModule { }
