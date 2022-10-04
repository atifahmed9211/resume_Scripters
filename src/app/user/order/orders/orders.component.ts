import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from '../../user.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnDestroy, OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  orders: any = [];
  dtInitial: boolean = false;
  userName;
  email;
  list_of_orders;
  package_title = [];
  service_type = [];
  user_order_status = environment.user_status;

  constructor(
    private as: UserService
  ) { }

  ngOnInit(): void {
    this.getOrders();
  }
  showOrderList = false;  //show order info into html page
  getOrders() {
    console.log("get order by user called");
    this.as.getOrdersByUser().subscribe((res) => {
      if (res) {
        this.showOrderList=true;
        console.log(res);
        this.orders = res.order;
        for (let temp of this.orders) {
          this.userName = temp.name;
          this.email = temp.email;
          this.list_of_orders = temp.orders;
          // for (let i of temp.orders)
          // {
          //   let a=i.packages;
          //   console.log("a",a);
          //   this.package_title.push(a[0].title);
          // }  
        }
        //for packages
        for (let temp of this.list_of_orders) {
          let a = temp.packages;
          if (a.length > 0) {
            let b = a[0];
            this.package_title.push(b.title);
          }
          else {
            this.package_title.push(null);
          }
        }
        //for service types
        for (let temp of this.list_of_orders) {
          let a = temp.service_types;
          if (a.length > 0) {
            let b = a[0];
            this.service_type.push(b.name);
          }
          else {
            this.service_type.push(null);
          }
        }
        console.log(this.service_type);
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
