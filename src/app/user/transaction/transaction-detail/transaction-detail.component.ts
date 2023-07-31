import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})

export class TransactionDetailComponent implements OnInit {

  public order = null;
  selectedOrderId = this.route.snapshot.paramMap.get('id');
  showOrderInfo = false;
  package;
  service;
  users;

  constructor(
    private route: ActivatedRoute,
    private us: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getOrder();
  }
  
  getOrder() {
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let usertoken = localStorage.getItem("userToken");
    //in case we delete token from browser(Application)
    if (usertoken != null) {
      this.us.getOrderById(this.selectedOrderId).subscribe((res) => {
        if (res) {
          this.showOrderInfo = true;
          this.order = res.order;
          this.package = this.order.packages[0]
          this.service = this.order.service_types[0]
          this.users=this.order.users[0];
        }
      },
        (error) => {
          //in case we edit token from browser(Application)
          console.log(error);
          if (error.status == 401) {
            //localStorage.removeItem("userToken");
            //localStorage.removeItem("user");
            //localStorage.removeItem("nick name");
            this.router.navigateByUrl('login');
            error.status = null;
          }
        })
    }
    else {
      this.router.navigateByUrl('login');
    }
  }
}
