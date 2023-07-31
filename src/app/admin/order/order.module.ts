import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRoutingModule } from './order-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './order/order.component';
import { DataTablesModule } from 'angular-datatables';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { FirstDraftComponent } from './order/first-draft/first-draft.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FinalDraftComponent } from './order/final-draft/final-draft.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { RevisionComponent } from './order/revision/revision.component';
import { AppHeaderModule } from '@coreui/angular';
import { WebsiteModule } from '../../website/website.module';

@NgModule({
  declarations: [OrdersComponent, OrderComponent, FirstDraftComponent, RevisionComponent,FinalDraftComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    TabsModule.forRoot(),
    OrderRoutingModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    CKEditorModule,
    AppHeaderModule,
    WebsiteModule
  ]
})
export class OrderModule { }
