import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { WebsiteService } from '../website.service';
// import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

  public regForm;
  emailexist = true;
  emailAlreadyInUse = false;
  public error = null;
  showLoading = false;
  signupError;

  constructor(
    private fb: FormBuilder,
    private webService: WebsiteService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.regForm = this.fb.group({
      role: ['User'],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  signUp() {
    this.showLoading = true;
    //check whether another user is login or not
    let token = localStorage.getItem("userToken");
    if (token) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem('nick name');
    }
    this.webService.validateEmail(this.email.value).subscribe((res) => {
      if (res.status == "valid") {
        this.emailexist = true;
        var user = this.regForm.value;
        this.webService.register(user).subscribe((res) => {
          if (res) {
            this.showLoading = false;
            this.toastr.success('Signup Successful', 'Success');
            this.router.navigate(['/login']);
          }
        },
          (error) => {
            this.showLoading = false;
            console.log(error)
            if (error.error == "user already exist") {
              this.emailAlreadyInUse = true;
            }
          })
      }
      else {
        this.emailexist = false;
        this.showLoading = false;
      }
    })
  }
  
  get email() {
    return this.regForm.get('email');
  }

  get password() {
    return this.regForm.get('password');
  }
  
  resetError() {
    this.signupError = ""
    this.emailexist = true;
    this.emailAlreadyInUse = false;
  }
}
