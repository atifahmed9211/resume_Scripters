import { Component, Input, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { WebsiteService } from '../website.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})

export class ContactUsComponent implements OnInit {

  emailexist = true;
  display_loading = false;
  contact_form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl(''),
    message: new FormControl('', [Validators.required])
  })

  constructor(
    public webService: WebsiteService
  ) { }

  ngOnInit() {
  }
  get name() {
    return this.contact_form.get('name');
  }
  get email() {
    return this.contact_form.get('email');
  }
  get message() {
    return this.contact_form.get('message');
  }
  sendMessage() {
    this.display_loading = true;
    if (!(this.contact_form.value.subject)) {
      this.contact_form.value.subject = this.contact_form.value.name;
    }
    let data = this.contact_form.value;
    //verify email exist or not
    this.webService.validateEmail(this.contact_form.value.email).subscribe((res) => {
      if (res) {
        this.display_loading = false;
        if (res.status == "valid") {
          this.emailexist = true;
          //to empty form values on submit
          this.contact_form.reset();
          this.webService.sendMessage(data).subscribe((res)=>{
            console.log();
          })
        }
        else {
          this.emailexist = false;
        }
      }
    })
  }
  resetError() {
    this.emailexist = true;
  }
}
