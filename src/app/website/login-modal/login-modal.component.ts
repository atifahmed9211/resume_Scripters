import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, Validators, FormBuilder, FormGroup, NgForm, } from '@angular/forms';
import { WebsiteService } from '../website.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database'
import { ToastrService } from 'ngx-toastr';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})

export class LoginModalComponent implements OnInit {

  show_forget_password_content=false;
  showLoading = false;
  loginError=false;
  ref = firebase.database().ref('users/');
  matcher = new MyErrorStateMatcher();
  public error = null;
  public url = null;

  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  public resetForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private webService: WebsiteService,
    private bsModalRef: BsModalRef,
    private router: Router, private route: ActivatedRoute,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.showLoading = true;
    let user = this.loginForm.value;
    this.webService.login(user).subscribe((res) => {
      if (res) {
        localStorage.setItem("userToken", res.token);
        this.webService.getUSer().subscribe((res) => {
          if (res.user.roles[0].name == "User") {
            //for firebase below line
            localStorage.setItem("nick name", res.user.name);
            localStorage.setItem("user", JSON.stringify(res.user));
            if (localStorage.getItem("url") == "register") {
              window.history.go(-2);
            } else {
              this.bsModalRef.hide();
              this.showLoading = false;
              this.toastr.success('Login Successful','Success')
              this.pageRefresh();
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
            this.loginError=true;
          });
      }
    },
      (error) => {
        console.log(error);
      });
  }

  addUserInFirebase() {
    setTimeout(() => {
      let nick_name = localStorage.getItem("nick name");
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

  pageRefresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./home'], {
      relativeTo: this.route
    })
  }

  register()
  {
    this.bsModalRef.hide();
    this.router.navigate(['./register']);
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
