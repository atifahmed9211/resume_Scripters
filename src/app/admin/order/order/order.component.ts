import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { environment } from '../../../../environments/environment';
import { AdminService } from '../../admin.service';
import { FormControl, FormGroup } from '@angular/forms';
import * as firebase from 'firebase'
import { DatePipe } from '@angular/common';
import { UserService } from '../../../user/user.service';
import * as html2pdf from 'html2pdf.js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FirstDraftComponent } from './first-draft/first-draft.component';
import { FinalDraftComponent } from './final-draft/final-draft.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RevisionComponent } from './revision/revision.component';

export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  //for firebase
  nickname = '';
  orders = [];
  isLoadingResults = true;
  chats = [];
  users = [];
  firstDraftModalRef: BsModalRef;
  revisionModalRef: BsModalRef;
  finalDraftModalRef: BsModalRef;
  firstDraftSend = false;
  selectedOrderId = this.route.snapshot.paramMap.get("id");
  ckContent = "";
  allOrderFiles = [];
  firstDraftFiles = [];
  adminRevisionFiles = [];
  finalDraftFiles = [];
  private baseUrl = environment.baseUrl;

  @ViewChild('orderTabs', { static: false }) orderTabs: TabsetComponent;
  @ViewChild('chatcontent') chatcontent: ElementRef;
  @ViewChild('fileMessage') fileMessage: ElementRef;

  scrolltop: number = null;

  public order = null;
  public questionaire_answer = null;
  public questionnaireFIle = null;
  public mediaUrl = environment.mediaUrl;
  public resumes_detail;
  public admin_status = environment.admin_status;

  constructor(
    private route: ActivatedRoute,
    private as: AdminService,
    private router: Router,
    public datepipe: DatePipe,
    public us: UserService,
    private modalService: BsModalService,
    private http: HttpClient,
  ) {
    this.nickname = localStorage.getItem('nickname');
    this.as.selectedOrderId = this.selectedOrderId;
    firebase.database().ref('orders/').on('value', resp => {
      this.orders = [];
      this.orders = snapshotToArray(resp);
      this.isLoadingResults = false;
    });
    firebase.database().ref('chats/').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
      setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
    });
    firebase.database().ref('orderusers/').orderByChild('orderid').equalTo(this.selectedOrderId).on('value', (resp2: any) => {
      const roomusers = snapshotToArray(resp2);
      this.users = roomusers.filter(x => x.status === 'online');
    });
  }
  ngOnInit(): void {
    this.getOrder();
  }
  showOrderInfo = false;  //show order info into html page
  getOrder() {
    this.CreateOrderInFireBase();
    this.as.getOrderById(this.selectedOrderId).subscribe((res) => {
      if (res) {
        this.showOrderInfo = true;
        console.log(res);
        this.order = res.order;
        if (this.order.answers != null) {
          this.questionaire_answer = JSON.parse(this.order.answers);
        }
        console.log("answer", this.questionaire_answer);
        if (this.order.resume_details) {
          this.resumes_detail = JSON.parse(this.order.resume_details);
        }
        //handling file tab files
        this.allOrderFiles = JSON.parse(this.order.files);
        //to remove previous values
        this.firstDraftFiles = [];
        this.adminRevisionFiles = [];
        this.finalDraftFiles = [];
        if (this.allOrderFiles) {
          for (let item of this.allOrderFiles) {
            if (item.file_status == "firstDraft") {
              this.firstDraftFiles.push(item);
            }
            else if (item.file_status == "adminRevision") {
              this.adminRevisionFiles.push(item);
            }
            else if (item.file_status == "finalDraft") {
              this.finalDraftFiles.push(item);
            }
          }
          console.log("All Order Files", this.allOrderFiles);
        }
      }
    },
      (error) => {
        console.log(error);
      })
  }
  chatForm = new FormGroup({
    attachFile: new FormControl(''),
    message: new FormControl(''),
  })
  enterChatRoom() {
    const chat = { orderId: '', nickname: '', type: '' };
    chat.orderId = this.selectedOrderId;
    chat.nickname = this.nickname;
    chat.type = 'join';
    const newMessage = firebase.database().ref('chats/').push();
    newMessage.set(chat);

    firebase.database().ref('orderusers/').orderByChild('orderid').equalTo(this.selectedOrderId).on('value', (resp: any) => {
      let orderuser = [];
      orderuser = snapshotToArray(resp);
      const user = orderuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = firebase.database().ref('orderusers/' + user.key);
        userRef.update({ status: 'online' });
      } else {
        const newOrderUser = { orderid: '', nickname: '', status: '' };
        newOrderUser.orderid = this.selectedOrderId;
        newOrderUser.nickname = this.nickname;
        newOrderUser.status = 'online';
        const neworderUser = firebase.database().ref('orderusers/').push();
        neworderUser.set(newOrderUser);
      }
    });
  }
  CreateOrderInFireBase() {
    firebase.database().ref('orders/').orderByChild('id').equalTo(this.selectedOrderId).once('value', (snapshott: any) => {
      console.log("snapshot", snapshott.exists());
      if (snapshott.exists()) {
        console.log('Order id already exist!');
      } else {
        const newOrder = firebase.database().ref('orders/').push();
        let ord = { "id": this.selectedOrderId }
        newOrder.set(ord);
        //this.router.navigate(['/roomlist']);
      }
    });
  }
  uploadMessagefile;
  fileIsSelected = false;

  //chat multiple file selected code start
  files = [];
  filesResponse = [];
  showLoader;
  //when user select file
  onFileChange(event) {
    this.send_btn_enable = true;
    this.showLoader = true;
    this.fileIsSelected = true;
    for (let i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
      this.sendFilesToAPI(event.target.files[i])
    }
    //this.text_Area_Message.nativeElement.disabled=true;
  }
  async sendFilesToAPI(file) {
    let formdata = new FormData;
    formdata.append("id", this.selectedOrderId);
    formdata.append("file", file);
    formdata.append("fileStatus", "user_chat_file");
    let token = localStorage.getItem("userToken");
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
  deleteItem(i: any) {
    console.log("index", i)
    this.files.splice(i, 1);
    console.log(this.filesResponse)
    this.filesResponse.splice(i, 1);
    console.log(this.filesResponse)
  }

  sendMessage(form: any) {
    if (this.send_btn_enable) {
      //this.text_Area_Message.nativeElement.disabled=false;
      console.log("send message method called");
      const chat = form;
      chat.orderId = this.selectedOrderId;
      chat.nickname = this.nickname;
      chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
      chat.type = 'message';
      let files_message;
      //in case user select file while chatting
      if (this.files.length >= 1) {
        //send file message in chat
        for (let i = 0; i < this.filesResponse.length; i++) {
          if (i > 0) {
            files_message += "<a href='" + this.mediaUrl + "" + this.filesResponse[i].file_path + "'target='_blank'>" + this.filesResponse[i].file + "</a><br/>";
            console.log(files_message);
          }
          else {
            files_message = "<a href='" + this.mediaUrl + "" + this.filesResponse[i].file_path + "'target='_blank'>" + this.filesResponse[i].file + "</a><br/>";
          }
        }
        let text_message: string = chat.message;
        chat.message = text_message + "<br/>" + files_message;
        console.log("chat", chat);
        const newMessage = firebase.database().ref('chats/').push();
        newMessage.set(chat);
      }
      //in case there is simple text message
      else {
        let text_message: string = chat.message;
        chat.message = text_message;
        console.log("chat", chat);
        const newMessage = firebase.database().ref('chats/').push();
        newMessage.set(chat);
      }
      this.ckContent = "";
      this.files = [];
      this.filesResponse = [];
      this.fileIsSelected = false;
      this.send_btn_enable = false;
    }
  }
  //chat multiple file selected code end

  send_btn_enable = false;
  send_btn_class(event) {
    let entered_values;
    entered_values = this.chatForm.value['message'];
    if (entered_values != "") {
      this.send_btn_enable = true
    }
    else {
      this.send_btn_enable = false;
    }
  }
  DownloadMessageFile(readerresult, file_Name) {
    const linkSource = readerresult;
    const downloadLink = document.createElement("a");
    const fileName = file_Name;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
  downloadResumeData() {
    const options = {
      filename: 'our_resume_file.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2Canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait' },
      margin: [10, 10, 20, 10]
    }
    const content: Element = document.getElementById('resume_data')
    html2pdf().from(content).set(options).save();
  }
  /*--------first draft code start-----------*/
  firstDraft_uploaded_files = [];
  sendFirstDraft() {
    this.firstDraftSend = true;
    //open first draft model
    this.firstDraftModalRef = this.modalService.show(FirstDraftComponent, { class: 'modal-dialog-centered', backdrop: 'static', keyboard: false, },);
    this.firstDraftModalRef.content.closeBtnName = 'Close';
    //check if model gets submitted
    this.firstDraftModalRef.onHidden.subscribe(() => {
      if (this.as.firstDraftData.status == "submitted") {
        this.enterChatRoom();
        console.log("firstDraftData", this.as.firstDraftData);
        //check whether the file is selected or not
        if (this.as.firstDraftData.files) {
          this.firstDraft_uploaded_files = this.as.firstDraftData.files;
          console.log('12343232', this.firstDraft_uploaded_files)
        }
        this.displayFirstDraftMessage()
      }
      //to hide send first draft button and to make background normal 
      this.firstDraftSend = false;
    }
    )
  }

  //send first draft message in chat
  displayFirstDraftMessage() {
    //let orderId = this.route.snapshot.paramMap.get("id");
    const chat = this.as.firstDraftData.firstDraft;
    chat.orderId = this.selectedOrderId;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'firstDraftMessage';
    console.log("chat", chat);
    let text_message: string = chat.message;
    //check whether the file is selected or not
    if (this.firstDraft_uploaded_files.length >= 1) {
      let files_message;
      console.log("uploaded files", this.firstDraft_uploaded_files[0])
      console.log("item", this.firstDraft_uploaded_files.length);
      for (let i = 0; i < this.firstDraft_uploaded_files.length; i++) {
        console.log(i, this.firstDraft_uploaded_files[i])
        if (i > 0) {
          files_message += "<a href='" + this.mediaUrl + "" + this.firstDraft_uploaded_files[i].file_path + "'target='_blank'>" + this.firstDraft_uploaded_files[i].file + "</a><br/>";
          console.log(files_message);
        }
        else {
          files_message = "<a href='" + this.mediaUrl + "" + this.firstDraft_uploaded_files[i].file_path + "'target='_blank'>" + this.firstDraft_uploaded_files[i].file + "</a><br/>";
        }
      }
      chat.message = text_message + "<br/>" + files_message;
      console.log("chat", chat);
      const newMessage = firebase.database().ref('chats/').push();
      newMessage.set(chat);
    }
    else {
      chat.message = text_message;
      console.log("chat", chat);
      const newMessage = firebase.database().ref('chats/').push();
      newMessage.set(chat);
    }
    //update-order-status
    let formData = new FormData;
    formData.append("id", this.selectedOrderId);
    formData.append("status", "3");
    this.as.updateOrder(formData).subscribe((res) => {
      console.log(res);
      this.getOrder();
    }
    )
  }
  /*--------first draft code end-----------*/

  /*--------Revision code start-----------*/
  adminRevision_uploaded_files = [];
  sendRevision() {
    //this.firstDraftSend = true;
    //open first draft model
    this.revisionModalRef = this.modalService.show(RevisionComponent, { class: 'modal-dialog-centered', backdrop: 'static', keyboard: false, },);
    this.revisionModalRef.content.closeBtnName = 'Close';
    //check if model gets submitted
    this.revisionModalRef.onHidden.subscribe(() => {
      if (this.as.adminRevisionData.status == "submitted") {
        this.enterChatRoom();
        console.log("firstDraftData", this.as.adminRevisionData);
        //check whether the file is selected or not
        if (this.as.adminRevisionData.files) {
          this.adminRevision_uploaded_files = this.as.adminRevisionData.files;
          console.log('12343232', this.adminRevision_uploaded_files)
        }
        this.displayRevisionMessage()
      }
      //to hide send first draft button and to make background normal 
      //this.firstDraftSend = false;
    }
    )
  }

  //send first draft message in chat
  displayRevisionMessage() {
    //let orderId = this.route.snapshot.paramMap.get("id");
    const chat = this.as.adminRevisionData.revisionDraft;
    console.log(this.as.adminRevisionData.revisionDraft);
    chat.orderId = this.selectedOrderId;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'adminRevisionMessage';
    console.log("chat", chat);
    let text_message: string = chat.message;
    //check whether the file is selected or not
    if (this.adminRevision_uploaded_files.length >= 1) {
      let files_message;
      console.log("uploaded files", this.adminRevision_uploaded_files[0])
      console.log("item", this.adminRevision_uploaded_files.length);
      for (let i = 0; i < this.adminRevision_uploaded_files.length; i++) {
        console.log(i, this.adminRevision_uploaded_files[i])
        if (i > 0) {
          files_message += "<a href='" + this.mediaUrl + "" + this.adminRevision_uploaded_files[i].file_path + "'target='_blank'>" + this.adminRevision_uploaded_files[i].file + "</a><br/>";
          console.log(files_message);
        }
        else {
          files_message = "<a href='" + this.mediaUrl + "" + this.adminRevision_uploaded_files[i].file_path + "'target='_blank'>" + this.adminRevision_uploaded_files[i].file + "</a><br/>";
        }
      }
      chat.message = text_message + "<br/>" + files_message;
      console.log("chat", chat);
      const newMessage = firebase.database().ref('chats/').push();
      newMessage.set(chat);
    }
    else {
      chat.message = text_message;
      console.log("chat", chat);
      const newMessage = firebase.database().ref('chats/').push();
      newMessage.set(chat);
    }
    //update-order-status
    let formData = new FormData;
    formData.append("id", this.selectedOrderId);
    formData.append("status", "5");
    this.as.updateOrder(formData).subscribe((res) => {
      console.log(res);
      this.getOrder();
    }
    )
  }
  /*--------Revision code end-----------*/

  /*--------Final Draft code start------*/
  finalDraft_uploaded_files = [];
  sendFinalDraft() {
    //this.firstDraftSend = true;
    //open first draft model
    this.finalDraftModalRef = this.modalService.show(FinalDraftComponent, { class: 'modal-dialog-centered', backdrop: 'static', keyboard: false, },);
    this.finalDraftModalRef.content.closeBtnName = 'Close';
    //check if model gets submitted
    this.finalDraftModalRef.onHidden.subscribe(() => {
      if (this.as.finalDraftData.status == "submitted") {
        this.enterChatRoom();
        console.log("finalDraftData", this.as.finalDraftData);
        //check whether the file is selected or not
        if (this.as.finalDraftData.files) {
          this.finalDraft_uploaded_files = this.as.finalDraftData.files;
          console.log('12343232', this.finalDraft_uploaded_files)
        }
        this.displayFinalDraftMessage()
      }
      //to hide send first draft button and to make background normal 
      //this.firstDraftSend = false;
    }
    )
  }

  //send final draft message in chat
  displayFinalDraftMessage() {
    //let orderId = this.route.snapshot.paramMap.get("id");
    const chat = this.as.finalDraftData.finalDraft;
    console.log(this.as.finalDraftData.finalDraft);
    chat.orderId = this.selectedOrderId;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'finalDraftMessage';
    console.log("chat", chat);
    let text_message: string = chat.message;
    //check whether the file is selected or not
    if (this.finalDraft_uploaded_files.length >= 1) {
      let files_message;
      console.log("uploaded files", this.finalDraft_uploaded_files[0])
      console.log("item", this.finalDraft_uploaded_files.length);
      for (let i = 0; i < this.finalDraft_uploaded_files.length; i++) {
        console.log(i, this.finalDraft_uploaded_files[i])
        if (i > 0) {
          files_message += "<a href='" + this.mediaUrl + "" + this.finalDraft_uploaded_files[i].file_path + "'target='_blank'>" + this.finalDraft_uploaded_files[i].file + "</a><br/>";
          console.log(files_message);
        }
        else {
          files_message = "<a href='" + this.mediaUrl + "" + this.finalDraft_uploaded_files[i].file_path + "'target='_blank'>" + this.finalDraft_uploaded_files[i].file + "</a><br/>";
        }
      }
      chat.message = text_message + "<br/>" + files_message;
      console.log("chat", chat);
      const newMessage = firebase.database().ref('chats/').push();
      newMessage.set(chat);
    }
    else {
      chat.message = text_message;
      console.log("chat", chat);
      const newMessage = firebase.database().ref('chats/').push();
      newMessage.set(chat);
    }
    //update-order-status
    let formData = new FormData;
    formData.append("id", this.selectedOrderId);
    formData.append("status", "6");
    this.as.updateOrder(formData).subscribe((res) => {
      console.log(res);
      this.getOrder();
    }
    )
  }
  /*--------Final Draft code end------*/
}
