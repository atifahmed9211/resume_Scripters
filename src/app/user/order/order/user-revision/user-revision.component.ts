import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Email } from '../../../../../assets/email/smtp.js';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../../user.service';
import { __await } from 'tslib';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-user-revision',
  templateUrl: './user-revision.component.html',
  styleUrls: ['./user-revision.component.scss']
})

export class UserRevisionComponent implements OnInit {

  @ViewChild('fileMessage') fileMessage: ElementRef;

  UserRevision = new FormGroup({
    message: new FormControl(''),
    attachFile: new FormControl('')
  })

  files = [];
  filesResponse = [];
  ckContent = ""
  showLoader;
  private baseUrl = environment.baseUrl;
  //for chat editor 
  public Editor = ClassicEditor;
  public config = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "indent",
        "outdent",
        "|",
        "blockQuote",
        "insertTable",
        "undo",
        "redo"
      ]
    },
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells"
      ]
    },
    language: "en",
  }

  constructor(
    public bsModalRef: BsModalRef,
    private route: ActivatedRoute,
    private us: UserService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onFileChange(event) {
    this.showLoader = true;
    for (let i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
      this.sendFilesToAPI(event.target.files[i])
    }
  }

  async sendFilesToAPI(file) {
    let formdata = new FormData;
    formdata.append("id", this.us.selectedOrderId);
    formdata.append("file", file);
    formdata.append("fileStatus", "userRevision");
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let usertoken = localStorage.getItem("userToken");
    //in case we delete token from browser(Application)
    if (usertoken != null) {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', `Bearer ${usertoken}`);
      const res = await this.http.post<any>(`${this.baseUrl}/update-order`, formdata, { headers }).toPromise();
      if (res) {
        this.filesResponse.push(res.data);
        this.showLoader = false;
        this.fileMessage.nativeElement.value = null;
      }
    } else {
      this.router.navigateByUrl('login');
    }
  }

  deleteItem(i) {
    this.files.splice(i, 1);
    this.filesResponse.splice(i, 1);
  }

  sendRevision() {
    this.sendEmail();
    //send form data to services
    let data
    //user have selected file or not
    if (this.filesResponse.length >= 1) {
      data = {
        userRevision: this.UserRevision.value,
        files: this.filesResponse,
        status: "submitted"
      }
      //send form data to services
      this.us.UserRevisionData = data;
      //to close dialogue box
      this.bsModalRef.hide();
    }
    //if there is a simple text message
    else if (this.UserRevision.value['message']) {
      data = {
        userRevision: this.UserRevision.value,
        status: "submitted"
      }
      //send form data to services
      this.us.UserRevisionData = data;
      //to close dialogue box
      this.bsModalRef.hide();
    }
    //if there is no message and no file
    else {
      this.hideModal();
    }
  }

  sendEmail() {
    Email.send({
      Host: 'smtp.elasticemail.com',
      Username: 'atif.ahmed9211@gmail.com',
      Password: '4A9170D3104909F97D6C312D8DA45A3900B3',
      To: 'atif.ahmed9211@gmail.com',
      From: `atif.ahmed9211@gmail.com`,
      Subject: 'Subject',
      Body: `
      <i>Hi! user, your revision has been submitted.</b> `
    }).then(message => { console.log(); });
  }

  // in case use cancelled the modal
  hideModal() {
    this.bsModalRef.hide();
    let data = {
      status: "cancelled"
    }
    this.us.UserRevisionData = data;
  }
}

