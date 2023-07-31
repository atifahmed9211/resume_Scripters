import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})

export class TransactionDetailComponent implements OnInit {

  public order = null;
  selectedOrderId=this.route.snapshot.paramMap.get('id');
  showOrderInfo=false;
  package;
  service;
  users;

  constructor(
    private as: AdminService,
    private route:ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getOrder();
  }
  
  getOrder() {
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.getOrderById(this.selectedOrderId).subscribe((res) => {
        if (res) {
          this.showOrderInfo = true;
          this.order = res.order;
          this.package=this.order.packages[0]
          this.service=this.order.service_types[0]
          this.users=this.order.users[0];
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
}
