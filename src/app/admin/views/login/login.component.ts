import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  
  ref = firebase.database().ref('users/');

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
        //for firebase below one line
        localStorage.setItem("nickname","admin");
        this.router.navigate(['admin/dashboard']);
      }
    },
    (error)=>{
      console.log(error);
    });
    //for firebase
    let loginFormValues={"nickname":"admin","email":this.loginForm.value['email']};
    console.log(loginFormValues);
    this.ref.orderByChild("nickname").equalTo("admin").once('value', snapshot => {
      if (snapshot.exists()) {
        console.log("user already exist in firebase");
      } else {
        const newUser = firebase.database().ref('users/').push();
        newUser.set(loginFormValues);
      }
    });
  }

  ngOnInit(){

  }
}
