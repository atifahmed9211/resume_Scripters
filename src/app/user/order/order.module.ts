import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './order/order.component';
import { DataTablesModule } from 'angular-datatables';
import { TabsModule } from 'ngx-bootstrap/tabs';
@NgModule({
  declarations: [OrdersComponent, OrderComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    TabsModule.forRoot(),
    OrderRoutingModule
  ]
})
export class OrderModule { }
