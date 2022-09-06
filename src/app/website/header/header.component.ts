import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { LoginComponent } from '../login/login.component';
import { SignupModalComponent } from '../signup-modal/signup-modal.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  username:any;

  @Input() logoSrc     = "./../../../assets/images/black-Logo.png";
  @Input() navbarClass = "navbar2";
  public user          = null;
  public url           = null;
  constructor(
    public router: ActivatedRoute,
    public route : Router,
    private modalService: BsModalService,
  ) { }
  bsModalRef: BsModalRef;

  ngOnInit() {
    this.router.data.subscribe((v)=>{
      if(localStorage.getItem("user")){
        this.user = JSON.parse(localStorage.getItem("user"))
        console.log(this.user);
        // to display username in html page
        this.username=this.user.name;
      }
      this.url = v.data;
      console.log(v.data);
      if(v.data != "login"){
        localStorage.setItem("url",v.data);
      }
    });
  }

  logout(){
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem('nickname');
    this.route.navigate(["/home"]);
    this.pageRefresh();
  }
  login()
  {
    this.bsModalRef = this.modalService.show(LoginModalComponent, {class: 'modal-dialog-centered'});
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  register()
  {
    this.bsModalRef = this.modalService.show(SignupModalComponent, {class: 'modal-dialog-centered'});
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  pageRefresh()
  {
    this.route.routeReuseStrategy.shouldReuseRoute=()=>false;
    this.route.onSameUrlNavigation='reload';
    this.route.navigate(['./'],{
      relativeTo:this.router
    })
  }
}
