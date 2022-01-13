import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { StripeComponent } from '../shared-components/stripe/stripe.component';
import { WebsiteService } from '../website.service';
import { ToastrService } from 'ngx-toastr';
import { LoginCheckModalComponent } from '../shared-components/login-check-modal/login-check-modal.component';
@Component({
  selector: 'app-federal-services',
  templateUrl: './federal-services.component.html',
  styleUrls: ['./federal-services.component.scss']
})
export class FederalServicesComponent implements OnInit {
  services = [];
  packages = [];
  bsModalRef: BsModalRef;
  navbarClass = "navbar2";
  amount      = null;

  constructor(
    private modalService: BsModalService,
    private webService  : WebsiteService,
    private router      : Router,
    
    ) { }
  
    buy(amount,id,type){
      if(localStorage.getItem("userToken")){
        const initialState = {
          amount:amount,
          id:id,
          service_type_id:1,
          type:type
        };
        this.bsModalRef = this.modalService.show(StripeComponent, {class: 'modal-dialog-centered',initialState});
        this.bsModalRef.content.closeBtnName = 'Close';
      }else{
        this.bsModalRef = this.modalService.show(LoginCheckModalComponent, {class: 'modal-dialog-centered'});
        this.bsModalRef.content.closeBtnName = 'Close';
      }
      
    }

  ngOnInit() {
    this.getServices();
  }

  getServices(){
    this.webService.getAllServices("Federal").subscribe((res)=>{
      console.log(res);
      this.services = res.service[0].services;
    },
    (error)=>{
      console.log(error);
    })
  }

  getPackages(){
    this.webService.getAllPackages("Federal").subscribe((res)=>{
      console.log(res);
      this.packages = res.packages;
    },
    (error)=>{
      console.log(error);
    })
  }

}
