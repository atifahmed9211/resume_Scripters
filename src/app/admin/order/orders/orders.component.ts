import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AdminService } from '../../admin.service';
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

  mediaUrl = environment.mediaUrl;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  orders: any = [];
  dtInitial: boolean = false;
  admin_order_status = environment.admin_status;
  pending_message: Subscription;
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
    private as: AdminService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getOrders();
    /* whenever our application start then at that time there would be no
    users in ordersusers in firebase.*/
    this.removeOrderUser();
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
          console.log(res.orders[0].users[0].name);
          this.showOrderList = true;
          this.orders = res.orders.slice().reverse();
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

  removeOrderUser() {
    let temp = [];
    firebase.database().ref('orderusers').once('value', resp => {
      temp = snapshotToArray(resp);
      for (let item of temp) {
        if (item.nickname == "admin") {
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
