import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Email } from '../../../../../assets/email/smtp.js';
import * as firebase from 'firebase'
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminService } from '../../../admin.service';
import { __await } from 'tslib';
import { identifierModuleUrl } from '@angular/compiler';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-final-draft',
  templateUrl: './final-draft.component.html',
  styleUrls: ['./final-draft.component.scss']
})
export class FinalDraftComponent implements OnInit {

  @ViewChild('fileMessage') fileMessage: ElementRef;

  files = [];
  filesResponse = [];
  ckContent = ""
  showLoader;
  private baseUrl = environment.baseUrl;
  constructor(
    public bsModalRef: BsModalRef,
    private route: ActivatedRoute,
    private as: AdminService,
    private http: HttpClient,

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
    formdata.append("id", this.as.selectedOrderId);
    formdata.append("file", file);
    formdata.append("fileStatus", "firstDraft");
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    const res = await this.http.post<any>(`${this.baseUrl}/update-order`, formdata, { headers }).toPromise();
    console.log("res", res);
    if (res) {
      this.filesResponse.push(res.data);
      this.showLoader = false;
      this.fileMessage.nativeElement.value = null;
    }
  }
  deleteItem(i) {
    this.files.splice(i, 1);
    this.filesResponse.splice(i, 1);
  }
  finalDraft = new FormGroup({
    message: new FormControl(''),
    attachFile: new FormControl('')
  })
  sendFinalDraft() {
    //this.sendEmail();
    //send form data to services
    let data
    //user have selected file or not
    if (this.filesResponse.length >= 1) {
      data = {
        finalDraft: this.finalDraft.value,
        files: this.filesResponse,
        status: "submitted"
      }
      //send form data to services
      this.as.finalDraftData = data;
      //to close dialogue box
      this.bsModalRef.hide();
    }
    //if there is a simple text message
    else if (this.finalDraft.value['message']) {
      data = {
        finalDraft: this.finalDraft.value,
        status: "submitted"
      }
      //send form data to services
      this.as.finalDraftData = data;
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
      To: 'talhafaizrasool@gmail.com',
      From: `atif.ahmed9211@gmail.com`,
      Subject: 'Subject',
      Body: `
      <i>Hi! user, your First Draft has been sent.</b> `
    }).then(message => { console.log(message); });
  }
  // in case use cancelled the modal
  hideModal() {
    this.bsModalRef.hide();
    let data = {
      status: "cancelled"
    }
    this.as.finalDraftData = data;
  }
}