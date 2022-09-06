import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder }  from '@angular/forms';
import { Router } from '@angular/router';
import { WebsiteService } from '../website.service';

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss']
})
export class SignupModalComponent implements OnInit {

  public regForm;

  public error = null;

  constructor(
    private fb         : FormBuilder,
    private webService : WebsiteService,
    private router     : Router
  ) {
    this.regForm = this.fb.group({
      role     : ['User'],
      name     : ['',[Validators.required]],
      email    : ['',[Validators.required,Validators.email]],
      password : ['',[Validators.required]]
    });
   }

  signUp(){
    var user = this.regForm.value;
    this.webService.register(user).subscribe((res)=>{
      console.log(res);
      this.router.navigateByUrl("/login");
    },
    (error)=>{
      console.log(error)
    })
  }
  ngOnInit(): void {
  }
}
