import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
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
import { ProfileComponent } from './profile/profile.component';
import { TransactionComponent } from './transaction/transaction.component';
import { TransactionDetailComponent } from './transaction/transaction-detail/transaction-detail.component';
import { DataTablesModule } from 'angular-datatables';
import { WebsiteModule } from '../website/website.module';

@NgModule({
  declarations: [UserComponent, ProfileComponent, TransactionComponent, TransactionDetailComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),
    FormsModule,
    TabsModule.forRoot(),
    ReactiveFormsModule,
    DataTablesModule,
    WebsiteModule
  ],
  providers: [
    IconSetService,
  ],
})
export class UserModule { }
