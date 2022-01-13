import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public loginForm = this.fb.group({
    email    : ['',[Validators.required,Validators.email]],
    password : ['',[Validators.required]]
  });

  public error = null;

  constructor(
    private fb    :FormBuilder,
    private as    :AdminService,
    private router:Router
  ){

  }

  login(){
    let user = this.loginForm.value;
    this.as.login(user).subscribe((res)=>{
      if(res.error){
        console.log(res.error);
        this.error = res.error;
      }else{
        console.log(res.token);
        localStorage.setItem("adminToken",res.token);
        this.router.navigate(['admin/dashboard']);
      }
    },
    (error)=>{
      console.log(error);
    });
  }

  ngOnInit(){

  }
}
