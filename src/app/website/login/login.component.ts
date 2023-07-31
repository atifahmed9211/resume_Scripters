import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { WebsiteService } from '../website.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  public resetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  show_forget_password_content=false;
  showLoading = false;
  loginError = false;
  ref = firebase.database().ref('users/');
  public error = null;
  public url = null;

  constructor(
    private fb: FormBuilder,
    private webService: WebsiteService,
    private location: Location,
    private router: Router,
    private toastr:ToastrService
  ) { }

  ngOnInit() {
    //check whether the user is already login or not
    let token = localStorage.getItem("userToken")
    if (token) {
      this.router.navigate(['/']);
    }
  }

  login() {
    this.showLoading = true;
    let user = this.loginForm.value;
    this.webService.login(user).subscribe((res) => {
      localStorage.setItem("userToken", res.token);
      this.webService.getUSer().subscribe((res) => {
        if (res.user.roles[0].name == "User") {
          //for firebase below line
          localStorage.setItem("nick name", res.user.name);
          localStorage.setItem("user", JSON.stringify(res.user));
          if (localStorage.getItem("url") == "register") {
            window.history.go(-2);
          } else {
            this.showLoading = false;
            if (this.webService.redirecting_url) {
              this.router.navigate([this.webService.redirecting_url]);
            }
            else {
              this.router.navigate(['/']);
            }
            //this.location.back();
          }
        } else {
          localStorage.removeItem("userToken");
        }
        this.addUserInFirebase();
      },
        (error) => {
          console.log(error);
          localStorage.removeItem("userToken");
          this.showLoading = false;
          this.loginError = true;
        });
    },
      (error) => {
        console.log(error);
      });
  }

  addUserInFirebase() {
    setTimeout(() => {
      let nick_name = localStorage.getItem("nick name")
      let loginFormValues = { "nickname": nick_name, "email": this.loginForm.value['email'] };
      this.ref.orderByChild("nickname").equalTo(nick_name).once('value', snapshot => {
        if (snapshot.exists()) {
          //console.log("");
        } else {
          const newUser = firebase.database().ref('users/').push();
          newUser.set(loginFormValues);
        }
      });
    }, 3000)
  }
  forgetPassword()
  {
    this.show_forget_password_content=true;
  }
  backToSignIn()
  {
    this.show_forget_password_content=false;
  }
  resetPassword()
  {
    let formdata=new FormData();
    formdata.append("email",this.resetForm.value["email"]) 
    this.webService.resetPassword(formdata).subscribe((res)=>{
      if(res.status==200)
      {
        this.toastr.success("Password has been reset.");
        this.show_forget_password_content=false;
      }
    })
  }
}
