import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Email } from '../../../../../assets/email/smtp.js';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminService } from '../../../admin.service';
import { __await } from 'tslib';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss']
})
export class RevisionComponent implements OnInit {

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
    formdata.append("fileStatus", "adminRevision");
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
  revisionDraft = new FormGroup({
    message: new FormControl(''),
    attachFile: new FormControl('')
  })
  sendRevision() {
    this.sendEmail();
    //send form data to services
    let data
    //user have selected file or not
    if (this.filesResponse.length >= 1) {
      data = {
        revisionDraft: this.revisionDraft.value,
        files: this.filesResponse,
        status: "submitted"
      }
      //send form data to services
      this.as.adminRevisionData = data;
      //to close dialogue box
      this.bsModalRef.hide();
    }
    //if there is a simple text message
    else if (this.revisionDraft.value['message']) {
      data = {
        revisionDraft: this.revisionDraft.value,
        status: "submitted"
      }
      //send form data to services
      this.as.adminRevisionData = data;
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
      <i>Hi! user, you have just received a revised document from career scripters.com.</b> `
    }).then(message => { console.log(message); });
  }
  // in case use cancelled the modal
  hideModal() {
    this.bsModalRef.hide();
    let data = {
      status: "cancelled"
    }
    this.as.firstDraftData = data;
  }
}

