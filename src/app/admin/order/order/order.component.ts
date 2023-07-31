import { Component, OnInit, ElementRef, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { environment } from '../../../../environments/environment';
import { AdminService } from '../../admin.service';
import { FormControl, FormGroup } from '@angular/forms';
import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
import { DatePipe } from '@angular/common';
import { UserService } from '../../../user/user.service';
import * as html2pdf from 'html2pdf.js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FirstDraftComponent } from './first-draft/first-draft.component';
import { FinalDraftComponent } from './final-draft/final-draft.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RevisionComponent } from './revision/revision.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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

  @ViewChild('orderTabs', { static: false }) orderTabs: TabsetComponent;
  @ViewChild('fileMessage') fileMessage: ElementRef;
  @ViewChild("outlet", { read: ViewContainerRef }) outletRef: ViewContainerRef;
  @ViewChild("content", { read: TemplateRef }) contentRef: TemplateRef<any>;
  @ViewChild("chatcontent") chatcontent: ElementRef;

  chatForm = new FormGroup({
    attachFile: new FormControl(''),
    message: new FormControl(''),
  })

  //for firebase
  nickname = '';
  orders = [];
  isLoadingResults = true;
  chats = [];
  users = [];
  firstDraftModalRef: BsModalRef;
  revisionModalRef: BsModalRef;
  finalDraftModalRef: BsModalRef;
  DraftSend = false;
  selectedOrderId = this.route.snapshot.paramMap.get("id");
  ckContent = "";
  allOrderFiles = [];
  firstDraftFiles = [];
  adminRevisionFiles = [];
  finalDraftFiles = [];
  private baseUrl = environment.baseUrl;
  order_status_color = {
    "1": "#00b7eb",
    "2": "#23A455",
    "3": "#ffc107",
    "4": "#607d8b",
    "5": "#FF0000",
    "6": "#00a67d",
  }

  public order = null;
  public questionaire_answer = null;
  public questionnaireFIle = null;
  public mediaUrl = environment.mediaUrl;
  public resumes_detail;
  public admin_status = environment.admin_status;
  showOrderInfo = false;  //show order info into html page
  uploadMessagefile;
  fileIsSelected = false;
  finalDraft_uploaded_files = [];
  send_btn_enable = false;
  firstDraft_uploaded_files = [];
  adminRevision_uploaded_files = [];
  files = []; //chat multiple file selected code
  filesResponse = []; //chat multiple file selected code
  showLoader; //chat multiple file selected code
  total_message = 0;
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
    language: "en"
  }

  constructor(
    private route: ActivatedRoute,
    private as: AdminService,
    private router: Router,
    public datepipe: DatePipe,
    public us: UserService,
    private modalService: BsModalService,
    private http: HttpClient,
  ) {
    this.nickname = localStorage.getItem('admin_nickname');
    this.as.selectedOrderId = this.selectedOrderId;
    firebase.database().ref('orders/').on('value', resp => {
      this.orders = [];
      this.orders = snapshotToArray(resp);
      this.isLoadingResults = false;
    });
    firebase.database().ref('chats/').on('value', resp => {
      this.chats = [];
      //here we getting complete chat including all orders.
      let complete_chat = snapshotToArray(resp);
      //extracting chat of specific order
      this.total_message = 0; //remove previous chat count
      for (let item of complete_chat) {
        if (item.orderId == this.selectedOrderId) {
          this.chats.push(item);
          if (item.type != 'join' && item.type != 'exit') {
            this.total_message += 1;
          }
        }
      }
    });
    //end
    firebase.database().ref('orderusers/').orderByChild('orderid').equalTo(this.selectedOrderId).on('value', (resp2: any) => {
      const roomusers = snapshotToArray(resp2);
      this.users = roomusers.filter(x => x.status === 'online');
    });
  }

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder() {
    this.CreateOrderInFireBase();
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.getOrderById(this.selectedOrderId).subscribe((res) => {
        if (res) {
          this.showOrderInfo = true;
          this.order = res.order;
          if (this.order.answers != null) {
            this.questionaire_answer = JSON.parse(this.order.answers);
          }
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
          }
        }
      },
        (error) => {
          console.log(error);
        })
    }
    else {
      this.router.navigateByUrl('admin/login');
    }
  }

  enterChatRoom() {
    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.contentRef);  //to show previous chat
    this.scrollToBottom();
    const chat = { orderId: '', nickname: '', type: '' };
    chat.orderId = this.selectedOrderId;
    chat.nickname = this.nickname;
    chat.type = 'join';
    const newMessage = firebase.database().ref('chats/').push();
    newMessage.set(chat);

    firebase.database().ref('orderusers/').orderByChild('orderid').equalTo(this.selectedOrderId).once('value', (resp: any) => {
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
      //remove pending message from firebase whenever user is online
      firebase.database().ref('pending_chat/').once('value', resp => {
        //here we getting complete chat including all orders.
        let temp = snapshotToArray(resp);
        //getting total user message
        for (let item of temp) {
          //for user message
          if (item.type == "user_message" && item.orderId == this.selectedOrderId) {
            if (item !== undefined) {
              const chatRef = firebase.database().ref('pending_chat/' + item.key);
              chatRef.remove();
            }
            else {
              console.log("");
            }
          }
          //for user revision
          else if (item.type == "userRevisionMessage" && item.orderId == this.selectedOrderId) {
            if (item !== undefined) {
              const chatRef = firebase.database().ref('pending_chat/' + item.key);
              chatRef.remove();
            }
            else {
              console.log("");
            }
          }
        }
      })
      //play notification sound on new upcoming message
      let flag = -1; //first time chat open kare to sound na aye,,
      firebase.database().ref('chats').on('value', (resp: any) => {
        if (flag == -1) {
          flag = 0;
        }
        else {
          let temp = snapshotToArray(resp);
          let last_message = temp[temp.length - 1];
          if (last_message.type == "user_message") {
            let audio: HTMLAudioElement = new Audio('https://drive.google.com/uc?export=download&id=1M95VOpto1cQ4FQHzNBaLf0WFQglrtWi7');
            audio.play();
            //re render html page 
            this.outletRef.clear();
            this.outletRef.createEmbeddedView(this.contentRef);
          }
          this.scrollToBottom();
        }
      })
    })
  }
  scrollToBottom() {
    setTimeout(() => {
      window.scroll(0, document.body.scrollHeight); //for main window
      this.chatcontent.nativeElement.scrollTo(0, this.chatcontent.nativeElement.scrollHeight); //to scroll message to last
    }, 500)
  }

  exitChat() {
    firebase.database().ref('orderusers/').orderByChild('orderid').equalTo(this.selectedOrderId).once('value', (resp: any) => {
      let orderuser;
      orderuser = snapshotToArray(resp);
      const user = orderuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = firebase.database().ref('orderusers/' + user.key);
        userRef.update({ status: 'offline' });
      }
    });
  }

  CreateOrderInFireBase() {
    firebase.database().ref('orders/').orderByChild('id').equalTo(this.selectedOrderId).once('value', (snapshott: any) => {
      if (snapshott.exists()) {
        //console.log('');
      } else {
        const newOrder = firebase.database().ref('orders/').push();
        let ord = { "id": this.selectedOrderId }
        newOrder.set(ord);
        //this.router.navigate(['/roomlist']);
      }
    });
  }

  //chat multiple file selected code start
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
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    const res = await this.http.post<any>(`${this.baseUrl}/update-order`, formdata, { headers }).toPromise();
    if (res) {
      this.filesResponse.push(res.data);
      this.showLoader = false;
      this.fileMessage.nativeElement.value = null;
    }
  }

  deleteItem(i: any) {
    this.files.splice(i, 1);
    this.filesResponse.splice(i, 1);
  }

  sendMessage(form: any) {
    if (this.send_btn_enable) {
      //this.text_Area_Message.nativeElement.disabled=false;
      const chat = form;
      chat.orderId = this.selectedOrderId;
      chat.nickname = this.nickname;
      chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
      chat.type = 'admin_message';
      let files_message;
      //in case user select file while chatting
      if (this.files.length >= 1) {
        //send file message in chat
        for (let i = 0; i < this.filesResponse.length; i++) {
          if (i > 0) {
            files_message += "<a href='" + this.mediaUrl + "" + this.filesResponse[i].file_path + "'target='_blank'>" + this.filesResponse[i].file + "</a><br/>";
          }
          else {
            files_message = "<a href='" + this.mediaUrl + "" + this.filesResponse[i].file_path + "'target='_blank'>" + this.filesResponse[i].file + "</a><br/>";
          }
        }
        let text_message: string = chat.message;
        chat.message = text_message + "<br/>" + files_message;
        const newMessage = firebase.database().ref('chats/').push();
        newMessage.set(chat);
        this.checkUserStatus(chat);
      }
      //in case there is simple text message
      else {
        let text_message: string = chat.message;
        chat.message = text_message;
        const newMessage = firebase.database().ref('chats/').push();
        newMessage.set(chat);
        this.checkUserStatus(chat);
      }
      this.ckContent = "";
      this.files = [];
      this.filesResponse = [];
      this.fileIsSelected = false;
      this.send_btn_enable = false;
    }
  }
  //chat multiple file selected code end

  checkUserStatus(chat) {
    /*check if the user is offline or whether the user exist in orderuser or 
    not */
    firebase.database().ref('orderusers').orderByChild('orderid').equalTo(this.selectedOrderId).once('value', (snapshot: any) => {
      let orderuser = snapshotToArray(snapshot);
      const user = orderuser.find(x => x.nickname != "admin");
      if (user != undefined) {
        if (user.status == "offline") {
          const newMessage = firebase.database().ref('pending_chat/').push();
          newMessage.set(chat);
        }
        else {
          console.log("");
        }
      }
      else {
        const newMessage = firebase.database().ref('pending_chat/').push();
        newMessage.set(chat);
      }
    })
  }

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
  sendFirstDraft() {
    this.DraftSend = true;
    //open first draft model
    this.firstDraftModalRef = this.modalService.show(FirstDraftComponent, { class: 'modal-dialog-centered', backdrop: 'static', keyboard: false, },);
    this.firstDraftModalRef.content.closeBtnName = 'Close';
    //check if model gets submitted
    this.firstDraftModalRef.onHidden.subscribe(() => {
      if (this.as.firstDraftData.status == "submitted") {
        //check whether the file is selected or not
        if (this.as.firstDraftData.files) {
          this.firstDraft_uploaded_files = this.as.firstDraftData.files;
        }
        this.displayFirstDraftMessage()
      }
      //to hide send first draft button and to make background normal 
      this.DraftSend = false;
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
    let text_message: string = chat.message;
    //check whether the file is selected or not
    if (this.firstDraft_uploaded_files.length >= 1) {
      this.checkUserStatus(chat);
      let files_message;
      for (let i = 0; i < this.firstDraft_uploaded_files.length; i++) {
        if (i > 0) {
          files_message += "<a href='" + this.mediaUrl + "" + this.firstDraft_uploaded_files[i].file_path + "'target='_blank'>" + this.firstDraft_uploaded_files[i].file + "</a><br/>";
        }
        else {
          files_message = "<a href='" + this.mediaUrl + "" + this.firstDraft_uploaded_files[i].file_path + "'target='_blank'>" + this.firstDraft_uploaded_files[i].file + "</a><br/>";
        }
      }
      chat.message = text_message + "<br/>" + files_message;
      const newMessage = firebase.database().ref('chats/').push();
      newMessage.set(chat);
    }
    else {
      chat.message = text_message;
      const newMessage = firebase.database().ref('chats/').push();
      newMessage.set(chat);
      this.checkUserStatus(chat);
    }
    //update-order-status
    let formData = new FormData;
    formData.append("id", this.selectedOrderId);
    formData.append("status", "3");
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.updateOrder(formData).subscribe((res) => {
        this.getOrder();
      })
    }
    else {
      this.router.navigateByUrl('admin');
    }
  }
  /*--------first draft code end-----------*/

  /*--------Revision code start-----------*/
  sendRevision() {
    this.DraftSend = true;
    //open first draft model
    this.revisionModalRef = this.modalService.show(RevisionComponent, { class: 'modal-dialog-centered', backdrop: 'static', keyboard: false, },);
    this.revisionModalRef.content.closeBtnName = 'Close';
    //check if model gets submitted
    this.revisionModalRef.onHidden.subscribe(() => {
      if (this.as.adminRevisionData.status == "submitted") {
        //check whether the file is selected or not
        if (this.as.adminRevisionData.files) {
          this.adminRevision_uploaded_files = this.as.adminRevisionData.files;
        }
        this.displayRevisionMessage()
      }
      //to hide send first draft button and to make background normal 
      this.DraftSend = false;
    }
    )
  }

  //send first draft message in chat
  displayRevisionMessage() {
    //let orderId = this.route.snapshot.paramMap.get("id");
    const chat = this.as.adminRevisionData.revisionDraft;
    chat.orderId = this.selectedOrderId;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'adminRevisionMessage';
    let text_message: string = chat.message;
    //check whether the file is selected or not
    if (this.adminRevision_uploaded_files.length >= 1) {
      this.checkUserStatus(chat);
      let files_message;
      for (let i = 0; i < this.adminRevision_uploaded_files.length; i++) {
        if (i > 0) {
          files_message += "<a href='" + this.mediaUrl + "" + this.adminRevision_uploaded_files[i].file_path + "'target='_blank'>" + this.adminRevision_uploaded_files[i].file + "</a><br/>";
        }
        else {
          files_message = "<a href='" + this.mediaUrl + "" + this.adminRevision_uploaded_files[i].file_path + "'target='_blank'>" + this.adminRevision_uploaded_files[i].file + "</a><br/>";
        }
      }
      chat.message = text_message + "<br/>" + files_message;
      const newMessage = firebase.database().ref('chats/').push();
      newMessage.set(chat);
    }
    else {
      chat.message = text_message;
      const newMessage = firebase.database().ref('chats/').push();
      newMessage.set(chat);
      this.checkUserStatus(chat);
    }
    //update-order-status
    let formData = new FormData;
    formData.append("id", this.selectedOrderId);
    formData.append("status", "5");
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.updateOrder(formData).subscribe((res) => {
        this.getOrder();
      })
    }
    else {
      this.router.navigateByUrl('admin/login');
    }
  }
  /*--------Revision code end-----------*/

  /*--------Final Draft code start------*/
  sendFinalDraft() {
    this.DraftSend = true;
    //open first draft model
    this.finalDraftModalRef = this.modalService.show(FinalDraftComponent, { class: 'modal-dialog-centered', backdrop: 'static', keyboard: false, },);
    this.finalDraftModalRef.content.closeBtnName = 'Close';
    //check if model gets submitted
    this.finalDraftModalRef.onHidden.subscribe(() => {
      if (this.as.finalDraftData.status == "submitted") {
        //check whether the file is selected or not
        if (this.as.finalDraftData.files) {
          this.finalDraft_uploaded_files = this.as.finalDraftData.files;
        }
        this.displayFinalDraftMessage()
      }
      //to hide send first draft button and to make background normal 
      this.DraftSend = false;
    }
    )
  }

  //send final draft message in chat
  displayFinalDraftMessage() {
    //let orderId = this.route.snapshot.paramMap.get("id");
    const chat = this.as.finalDraftData.finalDraft;
    chat.orderId = this.selectedOrderId;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'finalDraftMessage';
    let text_message: string = chat.message;
    //check whether the file is selected or not
    if (this.finalDraft_uploaded_files.length >= 1) {
      this.checkUserStatus(chat);
      let files_message;
      for (let i = 0; i < this.finalDraft_uploaded_files.length; i++) {
        if (i > 0) {
          files_message += "<a href='" + this.mediaUrl + "" + this.finalDraft_uploaded_files[i].file_path + "'target='_blank'>" + this.finalDraft_uploaded_files[i].file + "</a><br/>";
        }
        else {
          files_message = "<a href='" + this.mediaUrl + "" + this.finalDraft_uploaded_files[i].file_path + "'target='_blank'>" + this.finalDraft_uploaded_files[i].file + "</a><br/>";
        }
      }
      chat.message = text_message + "<br/>" + files_message;
      const newMessage = firebase.database().ref('chats/').push();
      newMessage.set(chat);
    }
    else {
      chat.message = text_message;
      const newMessage = firebase.database().ref('chats/').push();
      newMessage.set(chat);
      this.checkUserStatus(chat);
    }
    //update-order-status
    let formData = new FormData;
    formData.append("id", this.selectedOrderId);
    formData.append("status", "6");
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.updateOrder(formData).subscribe((res) => {
        this.getOrder();
      })
    }
    else {
      this.router.navigateByUrl('admin');
    }
  }
  /*--------Final Draft code end------*/
  openChat(btn) {
    this.enterChatRoom()
    $("#chat-box").css("visibility","visible");
    btn.style.visibility = "hidden";
  }
  closeChat(btn) {
    this.exitChat();
    $("#chat-box").css("visibility","hidden");
    btn.style.visibility = "visible";
  }
}
