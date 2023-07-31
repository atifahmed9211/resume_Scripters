import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from '../../user.service';
import { environment } from '../../../../environments/environment';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database'
import { Router } from '@angular/router';

export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];
  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });
  return returnArr;
};

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
  order_status_color = {
    "1": "#00b7eb",
    "2": "#23A455",
    "3": "#ffc107",
    "4": "#607d8b",
    "5": "#FF0000",
    "6": "#00a67d",
  }
  showOrderList = false;  //show order info into html page

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
    /* whenever our application start then at that time there would be no
   users in ordersusers in firebase.*/
    this.removeOrderUser();
  }

  getOrders() {
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let usertoken = localStorage.getItem("userToken");
    //in case we delete token from browser(Application)
    if (usertoken != null) {
      this.us.getOrdersByUser().subscribe((res) => {
        if (res) {
          this.showOrderList = true;
          this.orders = res.order;
          for (let temp of this.orders) {
            this.userName = temp.name;
            this.email = temp.email;
            this.list_of_orders = temp.orders.slice().reverse();
            console.log("test",this.list_of_orders);
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

  removeOrderUser() {
    let temp = [];
    firebase.database().ref('orderusers').once('value', resp => {
      temp = snapshotToArray(resp);
      for (let item of temp) {
        if (item.nickname != "admin") {
          const userRef = firebase.database().ref("orderusers/" + item.key)
          userRef.remove();
        }
      }
    })
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
