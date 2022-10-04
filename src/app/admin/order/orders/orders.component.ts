import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminService } from '../../admin.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnDestroy, OnInit {

  mediaUrl = environment.mediaUrl;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  orders: any = [];
  dtInitial: boolean = false;
  admin_order_status = environment.admin_status;

  constructor(
    private as: AdminService,
  ) {
  }

  ngOnInit(): void {
    this.getOrders();
  }
  showOrderList = false;  //show order info into html page
  getOrders() {
    this.as.getAllOrders().subscribe((res) => {
      if (res) {
        this.showOrderList = true;
        this.orders = res.orders;
        console.log(this.orders);
        this.dtTrigger.next();
      }
    },
      (error) => {
        console.log(error);
      })
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
