import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnDestroy,OnInit {
  
  dtOptions : DataTables.Settings = {};
  dtTrigger : Subject<any>        = new Subject<any>();
  orders    : any                 = [];
  dtInitial : boolean             = false;

  constructor(
    private as:UserService
  ) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(){
    this.as.getOrdersByUser().subscribe((res)=>{
      console.log(res);
      this.orders = res.order;
      console.log(this.orders);
      this.dtTrigger.next();
    },
    (error)=>{
      console.log(error);
    })
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
