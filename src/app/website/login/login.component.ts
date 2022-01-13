import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder }  from '@angular/forms';
import { Router } from '@angular/router';
import { WebsiteService } from '../website.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm = this.fb.group({
    email    : ['',[Validators.required,Validators.email]],
    password : ['',[Validators.required]]
  });

  public error    = null;
  public url      = null;
  constructor(
    private fb         : FormBuilder,
    private webService : WebsiteService,
    private location   : Location
  ) { }

  login(){
    let user = this.loginForm.value;
    this.webService.login(user).subscribe((res)=>{
      localStorage.setItem("userToken",res.token);
      this.webService.getUSer().subscribe((res)=>{
        if(res.user.roles[0].name=="User"){
          localStorage.setItem("user",JSON.stringify(res.user));
          if(localStorage.getItem("url")=="register"){
            window.history.go(-2);
          }else{
            this.location.back();
          }
        }else{
          localStorage.removeItem("userToken");
        }
      },
      (error)=>{
        console.log(error);
        localStorage.removeItem("userToken");
      });
    },
    (error)=>{
      console.log(error);
    });
  }

  ngOnInit() {
  }

}
