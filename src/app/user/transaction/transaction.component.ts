import { Component, OnInit,OnDestroy } from '@angular/core';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})

export class TransactionComponent implements OnInit,OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  showOrderList = false;
  orders: any = [];
  list_of_orders;
  package_title = [];
  service_type = [];

  constructor(
    private us: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.getOrders();
  }

  getOrders() { 
    let usertoken = localStorage.getItem("userToken");
    if (usertoken != null) {
      this.us.getOrdersByUser().subscribe((res) => {
        if (res) {
          this.showOrderList = true;
          this.orders = res.order;
          for (let temp of this.orders) {
            this.list_of_orders = temp.orders.slice().reverse();
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
          this.dtTrigger.next();
        }
      },
        (error) => {
          //in case we edit token from browser(Application)
          console.log(error);
          if (error.status == 401) {
            localStorage.removeItem("userToken");
            localStorage.removeItem("user");
            localStorage.removeItem("nick name");
            this.router.navigateByUrl('login');
          }
        })
    }
    else {
      this.router.navigateByUrl('login');
    }
  }
  
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
