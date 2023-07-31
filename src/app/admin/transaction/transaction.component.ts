import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})

export class TransactionComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  showOrderList = false;
  orders: any = [];
  package_title = [];
  service_type = [];
  
  constructor(
    private router: Router,
    private as: AdminService,
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.getOrders();
  }
  getOrders() {
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.getAllOrders().subscribe((res) => {
        if (res) {
          this.showOrderList = true;
          this.orders = res.orders.slice().reverse();
          //for packages
          for (let temp of this.orders) {
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
          for (let temp of this.orders) {
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
          console.log(error);
        })
    }
    else {
      this.router.navigateByUrl('admin/login');
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
