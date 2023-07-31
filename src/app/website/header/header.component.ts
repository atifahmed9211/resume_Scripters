import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  @Input() navbarClass = "navbar1";

  username:any;
  public user          = null;
  public url           = null;
  bsModalRef: BsModalRef;

  constructor(
    public router: ActivatedRoute,
    public route : Router,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.router.data.subscribe((v)=>{
      if(localStorage.getItem("user")){
        this.user = JSON.parse(localStorage.getItem("user"))
        // to display username in html page
        this.username=this.user.name;
      }
      this.url = v.data;
      if(v.data != "login"){
        localStorage.setItem("url",v.data);
      }
    });
  }

  logout(){
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem('nick name');
    this.route.navigate(["/home"]);
    this.pageRefresh();
  }

  login()
  {
    this.bsModalRef = this.modalService.show(LoginModalComponent, {class: 'modal-dialog-centered'});
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

//hide menu when we click outside of the menu.
$(document).ready(function () {
  $(document).click(function (event) {
      var clickover = $(event.target);
      var _opened = $(".navbar-collapse").hasClass("show");
      if (_opened === true && !clickover.hasClass("navbar-toggler")) {
          $(".navbar-toggler").click();
      }
  });
});
