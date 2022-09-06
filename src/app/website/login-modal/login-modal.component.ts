import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, Validators, FormBuilder, FormGroup, NgForm, }  from '@angular/forms';
import { WebsiteService } from '../website.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {Router,ActivatedRoute} from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import * as firebase from 'firebase';


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

  ref = firebase.database().ref('users/');
  matcher = new MyErrorStateMatcher();

  public loginForm = this.formBuilder.group({
    email    : ['',[Validators.required,Validators.email]],
    password : ['',[Validators.required]]
  });

  public error    = null;
  public url      = null;
  constructor(
    private formBuilder: FormBuilder,
    private webService : WebsiteService,
    private location   : Location,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private router:Router,private route:ActivatedRoute
  ) { }

  login(){
    let user = this.loginForm.value;
    let nickName:string="";
    this.webService.login(user).subscribe((res)=>{
      localStorage.setItem("userToken",res.token);
      this.webService.getUSer().subscribe((res)=>{
        if(res.user.roles[0].name=="User"){
          //for firebase below two line
           nickName=res.user.name;
           localStorage.setItem("nick name",nickName);
          localStorage.setItem("user",JSON.stringify(res.user));
          if(localStorage.getItem("url")=="register"){
            window.history.go(-2);
          }else{
            this.bsModalRef.hide();
            this.pageRefresh();
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
    this.addUserInFirebase(nickName);
  }
  addUserInFirebase(nickName)
  {
    let nick_name=localStorage.getItem("nick name")
    let loginFormValues={"nickname":nick_name,"email":this.loginForm.value['email']};
    console.log(loginFormValues);
    this.ref.orderByChild("nickname").equalTo(nick_name).once('value', snapshot => {
      if (snapshot.exists()) {
        console.log("user already exist in firebase");
      } else {
        const newUser = firebase.database().ref('users/').push();
        newUser.set(loginFormValues);
      }
    });
  }
  pageRefresh()
  {
    this.router.routeReuseStrategy.shouldReuseRoute=()=>false;
    this.router.onSameUrlNavigation='reload';
    this.router.navigate(['./home'],{
      relativeTo:this.route
    })    
  }

  ngOnInit(): void {
  }

}
