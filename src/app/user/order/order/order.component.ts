import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../admin/admin.service';
import * as firebase from 'firebase';
import { DatePipe, DOCUMENT } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserRevisionComponent } from './user-revision/user-revision.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  styleUrls: ['./order.component.scss'],
})
//@Pipe({ name: 'safe' })
export class OrderComponent implements OnInit, PipeTransform {
  //for firebase
  nickname = '';
  orders = [];
  isLoadingResults = true;
  chats = [];
  users = [];
  public questionaire_answer = null;
  ckContent = "";
  allOrderFiles = [];
  firstDraftFiles = [];
  adminRevisionFiles = [];
  finalDraftFiles = [];
  bsModalRef: BsModalRef;
  private baseUrl = environment.baseUrl;
  selectedOrderId = this.route.snapshot.paramMap.get("id");


  @ViewChild('orderTabs', { static: false }) orderTabs: TabsetComponent;
  @ViewChild('chatcontent') chatcontent: ElementRef;
  @ViewChild('fileMessage') fileMessage: ElementRef;
  scrolltop: number = null;

  public order: any = {};
  public questionnaireFIle = null;
  public mediaUrl = environment.mediaUrl;
  public user_status = environment.user_status;

  constructor(
    private route: ActivatedRoute,
    private us: UserService,
    private as: AdminService,
    public datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private http: HttpClient,
  ) {
    this.nickname = localStorage.getItem('nick name');
    console.log("nick name = ", this.nickname);
    this.us.selectedOrderId = this.selectedOrderId;
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
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  ngOnInit(): void {
    this.getOrder();
  }
  showOrderInfo=false;  //show order info into html page
  getOrder() {
    this.CreateOrderInFireBase();
    console.log("get order mathed called");
    this.us.getOrderById(this.selectedOrderId).subscribe((res) => {
      if (res) {
        this.showOrderInfo=true;
        console.log(res);
        this.order = res.order;
        this.questionaire_answer = JSON.parse(this.order.answers);
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
    let orderId = this.route.snapshot.paramMap.get("id");
    firebase.database().ref('orders/').orderByChild('id').equalTo(orderId).once('value', (snapshott: any) => {
      console.log("snapshot", snapshott.exists());
      if (snapshott.exists()) {
        console.log('Order id already exist!');
      } else {
        const newOrder = firebase.database().ref('orders/').push();
        let ord = { "id": orderId }
        newOrder.set(ord);
        //this.router.navigate(['/roomlist']);
      }
    });
  }
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
    formdata.append("id", this.route.snapshot.paramMap.get("id"));
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
  enterKeyPressed() {
    console.log("user pressed enter key");
  }
  DownloadMessageFile(readerresult, file_Name) {
    const linkSource = readerresult;
    const downloadLink = document.createElement("a");
    const fileName = file_Name;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
  questionForm: FormGroup = new FormGroup({
    resume: new FormControl('', [Validators.required]),
    q1: new FormControl(''),
    q2: new FormControl(''),
    q3: new FormControl(''),
    q4: new FormControl(''),
    q5: new FormControl(''),
    q6: new FormControl(''),
    q7: new FormControl(''),
    q8: new FormControl(''),
  })
  formData = new FormData();
  selectedResume;
  submitCV(event) {
    this.selectedResume = event.target.files[0];
    this.formData.append("file", this.selectedResume);
  }
  submitQuestion() {
    console.log(JSON.stringify(this.questionForm.value))
    this.formData.append("id", this.order.id);
    this.formData.append("answers", JSON.stringify(this.questionForm.value));
    this.us.uploadAnswersFile(this.formData).subscribe((res) => {
      console.log(res);
      this.getOrder();
    },
      (error) => {
        console.log(error);
      })
  }
  chatForm = new FormGroup({
    attachFile: new FormControl(''),
    message: new FormControl(''),
  })

  // uploadFile(event){
  //   this.questionnaireFIle = event.target.files[0];
  //   let formData = new FormData();
  //   formData.append("id",this.order.id);
  //   formData.append("file",this.questionnaireFIle);
  //   this.as.uploadAnswersFile(formData).subscribe((res)=>{
  //     console.log(res);
  //     this.getOrder();
  //   },
  //   (error)=>{
  //     console.log(error);
  //   })
  // }
  updateOrderStatus(status) {
    let formData = new FormData;
    formData.append("id", this.selectedOrderId);
    if (status == "approve") {
      formData.append("status", "4");
      this.as.updateOrder(formData).subscribe((res) => {
        console.log(res);
        this.getOrder();
      });
    }
    else {
      formData.append("status", "5");
      this.as.updateOrder(formData).subscribe((res) => {
        console.log(res);
        this.getOrder();
      })
      //---------user revision code start---------//
      //open user revision model
      this.bsModalRef = this.modalService.show(UserRevisionComponent, { class: 'modal-dialog-centered' });
      this.bsModalRef.content.closeBtnName = 'Close';
      let uploaded_files = [];
      //check if model gets submitted
      this.bsModalRef.onHidden.subscribe(() => {
        if (this.us.UserRevisionData.status == "submitted") {
          this.enterChatRoom();
          console.log("firstDraftData", this.us.UserRevisionData);
          //check whether the file is selected or not
          if (this.us.UserRevisionData.files) {
            uploaded_files = this.us.UserRevisionData.files;
            console.log('12343232', uploaded_files)
          }
          this.displayRevisionMessage(uploaded_files)
        }
        //to hide send first draft button and to make background normal 
        //this.firstDraftSend = false;
      }
      )
    }
  }

  //send user revision message in chat
  displayRevisionMessage(uploaded_files) {
    //let orderId = this.route.snapshot.paramMap.get("id");
    const chat = this.us.UserRevisionData.userRevision;
    chat.orderId = this.selectedOrderId;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'userRevisionMessage';
    console.log("chat", chat);
    let text_message: string = chat.message;
    //check whether the file is selected or not
    if (uploaded_files.length >= 1) {
      let files_message;
      console.log("uploaded files", uploaded_files[0])
      console.log("item", uploaded_files.length);
      for (let i = 0; i < uploaded_files.length; i++) {
        console.log(i, uploaded_files[i])
        if (i > 0) {
          files_message += "<a href='" + this.mediaUrl + "" + uploaded_files[i].file_path + "'target='_blank'>" + uploaded_files[i].file + "</a><br/>";
          console.log(files_message);
        }
        else {
          files_message = "<a href='" + this.mediaUrl + "" + uploaded_files[i].file_path + "'target='_blank'>" + uploaded_files[i].file + "</a><br/>";
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
  }
}
  //---------user revision code end---------//