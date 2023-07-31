import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRoutingModule } from './order-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './order/order.component';
import { DataTablesModule } from 'angular-datatables';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import {NgxDocViewerModule} from 'ngx-doc-viewer';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular' 
import { FormsModule } from '@angular/forms';
import { ResumeDataComponent } from './order/resume-data/resume-data.component';
import { UserRevisionComponent } from './order/user-revision/user-revision.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { WebsiteModule } from '../../website/website.module';

@NgModule({
  declarations: [OrdersComponent, OrderComponent, ResumeDataComponent, UserRevisionComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    TabsModule.forRoot(),
    OrderRoutingModule,
    ReactiveFormsModule,
    NgxDocViewerModule,
    CKEditorModule,
    FormsModule,
    ModalModule.forRoot(),
    WebsiteModule
  ],
})
export class OrderModule { }
