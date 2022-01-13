import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() logoSrc     = "./../../../assets/images/black-Logo.png";
  @Input() navbarClass = "navbar2";
  public user          = null;
  public url           = null;
  constructor(
    public router: ActivatedRoute,
    public route : Router
  ) { }

  ngOnInit() {
    this.router.data.subscribe((v)=>{
      if(localStorage.getItem("user")){
        this.user = JSON.parse(localStorage.getItem("user"));
        console.log(this.user);
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
    this.route.navigate(["/login"]);
  }

}
