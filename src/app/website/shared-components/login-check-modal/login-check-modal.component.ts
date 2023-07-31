import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WebsiteService } from '../../website.service';

@Component({
  selector: 'app-login-check-modal',
  templateUrl: './login-check-modal.component.html',
  styleUrls: ['./login-check-modal.component.scss']
})

export class LoginCheckModalComponent implements OnInit {

  critiqueModal: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  public userEmail = null;
  emailexist = true;
  showEmailVerification = false;

  constructor(
    public bsModalRef: BsModalRef,
    private router: Router, private route: ActivatedRoute,
    private webService: WebsiteService,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem("user")) {
      this.userEmail = (JSON.parse(localStorage.getItem("user"))).email;
      if (this.userEmail) {
        this.critiqueModal.controls['email'].setValue(this.userEmail);
      }
    }
  }

  verifyEmail() {
    this.webService.validateEmail(this.email.value).subscribe((res) => {
      if (res.status == "valid") {
        this.emailexist = true;
        this.showEmailVerification = true;
      }
      else {
        this.emailexist = false;
      }
    })
  }

  uploadCV() {
    let formData = new FormData();
    formData.append("email", this.critiqueModal.value.email);
    formData.append("file", this.webService.uploadedCVFile);
    this.webService.critiqueTaskCompleted = true;
    this.webService.createCritique(formData).subscribe((res) => {
      console.log();
    },
      (error) => {
        console.log(error);
        //this.toastr.error('Resume Upload Failed', 'Error');
      })
    this.bsModalRef.hide();
  }
  get email() {
    return this.critiqueModal.get('email');
  }

  resetErrorResponse() {
    this.emailexist = true;
  }
}
