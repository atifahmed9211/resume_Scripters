import { Component, OnInit, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app'

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
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  @ViewChild("outlet", { read: ViewContainerRef }) outletRef: ViewContainerRef;
  @ViewChild("content", { read: TemplateRef }) contentRef: TemplateRef<any>;

  orders: any = [];
  pending_orders: number = 0;
  completed_orders: number = 0;
  critiques: any = [];
  pending_critiques: any = [];
  completed_critiques: any = [];
  blogs = [];
  online_members;
  Total_Revenue = 0;

  constructor(
    private as: AdminService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getAdmin();
    this.getOrders();
    this.getCritiques();
    this.getBlogs();
    this.getOnlineMembers();
  }

  ngAfterContentInit() {
    this.outletRef.createEmbeddedView(this.contentRef); //to show previous online member 
  }

  getAdmin() {
    this.as.getAdmin().subscribe((res) => {
    },
      (error) => {
        console.log(error);
      })
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
          //this.showOrderList = true;
          this.orders = res.orders;
          if (this.orders.length != 0) {
            //extracting pending orders and completed orders
            for (let item of this.orders) {
              if (item.status != 6) {
                this.pending_orders++;
              }
              else {
                this.completed_orders++;
              }
            }
            //calculate revenue
            for (let item of this.orders) {
              let price = parseInt(item.price)
              this.Total_Revenue += price;
            }
          }
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

  getCritiques() {
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.getAllCritiques().subscribe((res) => {
        if (res) {
          //this.showCritiqueList = true;
          this.critiques = res.critiques;
          for (let item of this.critiques) {
            if (item.status == 'Pending') {
              this.pending_critiques++;
            }
            else {
              this.completed_critiques++;
            }
          }
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

  getBlogs() {
    this.as.getAllBlogs().subscribe((res) => {
      this.blogs = res.blogs;
    },
      (error) => {
        console.log(error);
      })
  }
  
  getOnlineMembers() {
    firebase.database().ref('orderusers/').orderByChild('orderid').on('value', (resp2: any) => {
      const roomusers = snapshotToArray(resp2);
      this.online_members = roomusers.filter(x => x.status === 'online');
      //re render html page 
      this.outletRef.clear();
      this.outletRef.createEmbeddedView(this.contentRef);
    });
  }
}
