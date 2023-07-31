import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database'

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  ref = firebase.database().ref('users/');

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  public error = null;

  constructor(
    private fb: FormBuilder,
    private as: AdminService,
    private router: Router
  ) {

  }
  ngOnInit() {
    //check whether the user is already login or not
    let token = localStorage.getItem("adminToken")
    if (token) {
      this.router.navigate(['admin/dashboard']);
    }
  }

  login() {
    let user = this.loginForm.value;
    this.as.login(user).subscribe((res) => {
      if (res.error) {
        console.log(res.error);
        this.error = res.error;
      } else {
        localStorage.setItem("adminToken", res.token);
        //for firebase below one line
        localStorage.setItem("admin_nickname", "admin");
        this.router.navigate(['admin/dashboard']);
      }
    },
      (error) => {
        console.log(error);
      });
    //for firebase
    let loginFormValues = { "nickname": "admin", "email": this.loginForm.value['email'] };
    this.ref.orderByChild("nickname").equalTo("admin").once('value', snapshot => {
      if (snapshot.exists()) {
        //console.log("");
      } else {
        const newUser = firebase.database().ref('users/').push();
        newUser.set(loginFormValues);
      }
    });
  }
}
