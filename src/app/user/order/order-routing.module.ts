import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  {
    path:"",
    data:{
      title:"Orders"
    },
    children:[
      {
        path:"all",
        component:OrdersComponent,
        data:{
          title:"All Orders"
        }
      },
      {
        path:"order/:id",
        component:OrderComponent,
        data:{
          title:"Order Detail"
        }
      },
      {
        path:"",
        redirectTo:"all",
        pathMatch:"full"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
