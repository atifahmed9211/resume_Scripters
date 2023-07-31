import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../admin/admin.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database'
import { DatePipe, DOCUMENT } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserRevisionComponent } from './user-revision/user-revision.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
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
  styleUrls: ['./order.component.scss'],
})

//@Pipe({ name: 'safe' })
export class OrderComponent implements OnInit, PipeTransform {

  @ViewChild('orderTabs', { static: false }) orderTabs: TabsetComponent;
  @ViewChild('chatcontent') chatcontent: ElementRef;
  @ViewChild('fileMessage') fileMessage: ElementRef;
  @ViewChild("outlet", { read: ViewContainerRef }) outletRef: ViewContainerRef;
  @ViewChild("content", { read: TemplateRef }) contentRef: TemplateRef<any>;

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
  public questionaire_answer = null;
  ckContent = "";
  allOrderFiles = [];
  firstDraftFiles = [];
  adminRevisionFiles = [];
  finalDraftFiles = [];
  bsModalRef: BsModalRef;
  private baseUrl = environment.baseUrl;
  selectedOrderId = this.route.snapshot.paramMap.get("id");
  DraftSend = false;
  order_status_color = {
    "1": "#00b7eb",
    "2": "#23A455",
    "3": "#ffc107",
    "4": "#607d8b",
    "5": "#FF0000",
    "6": "#00a67d",
  }
  public order: any = {};
  public questionnaireFIle = null;
  public mediaUrl = environment.mediaUrl;
  public user_status = environment.user_status;
  public resumes_detail = false;
  showOrderInfo = false;  //show order info into html page
  fileIsSelected = false;
  files = []; //chat multiple file selected code
  filesResponse = []; //chat multiple file selected code
  showLoader; //chat multiple file selected code
  send_btn_enable = false;
  formData = new FormData();
  selectedResume;
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
    private us: UserService,
    private as: AdminService,
    public datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private http: HttpClient,
    private router: Router
  ) {
    this.nickname = localStorage.getItem('nick name');
    this.us.selectedOrderId = this.selectedOrderId;
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
    firebase.database().ref('orderusers/').orderByChild('orderid').equalTo(this.selectedOrderId).on('value', (resp2: any) => {
      const roomusers = snapshotToArray(resp2);
      this.users = roomusers.filter(x => x.status === 'online');
    });
  }

  ngOnInit(): void {
    this.getOrder();
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getOrder() {
    this.CreateOrderInFireBase();
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let usertoken = localStorage.getItem("userToken");
    //in case we delete token from browser(Application)
    if (usertoken != null) {
      this.us.getOrderById(this.selectedOrderId).subscribe((res) => {
        if (res) {
          this.showOrderInfo = true;
          this.order = res.order;
          this.questionaire_answer = JSON.parse(this.order.answers);
          if (this.order.resume_details) {
            this.resumes_detail = true;
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
          //in case we edit token from browser(Application)
          console.log(error);
          if (error.status == 401) {
            //localStorage.removeItem("userToken");
            //localStorage.removeItem("user");
            //localStorage.removeItem("nick name");
            this.router.navigateByUrl('login');
            error.status = null;
          }
        })
    }
    else {
      this.router.navigateByUrl('login');
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
          //for admin message
          if (item.type == "admin_message" && item.orderId == this.selectedOrderId) {
            if (item !== undefined) {
              const chatRef = firebase.database().ref('pending_chat/' + item.key);
              chatRef.remove();
            }
            else {
              console.log("");
            }
          }
          //for first draft message
          else if (item.type == "firstDraftMessage" && item.orderId == this.selectedOrderId) {
            if (item !== undefined) {
              const chatRef = firebase.database().ref('pending_chat/' + item.key);
              chatRef.remove();
            }
            else {
              console.log("");
            }
          }
          //for admin Revision Message
          else if (item.type == "adminRevisionMessage" && item.orderId == this.selectedOrderId) {
            if (item !== undefined) {
              const chatRef = firebase.database().ref('pending_chat/' + item.key);
              chatRef.remove();
            }
            else {
              console.log("");
            }
          }
          //for final Draft Message
          else if (item.type == "finalDraftMessage" && item.orderId == this.selectedOrderId) {
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
          if (last_message.type == "admin_message") {
            let audio: HTMLAudioElement = new Audio('https://drive.google.com/uc?export=download&id=1M95VOpto1cQ4FQHzNBaLf0WFQglrtWi7');
            audio.play();
            //re render html page 
            this.outletRef.clear();
            this.outletRef.createEmbeddedView(this.contentRef);
          }
          this.scrollToBottom();
        }
      })
    });
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
    let orderId = this.route.snapshot.paramMap.get("id");
    firebase.database().ref('orders/').orderByChild('id').equalTo(orderId).once('value', (snapshott: any) => {
      if (snapshott.exists()) {
        //console.log('');
      } else {
        const newOrder = firebase.database().ref('orders/').push();
        let ord = { "id": orderId }
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
    formdata.append("id", this.route.snapshot.paramMap.get("id"));
    formdata.append("file", file);
    formdata.append("fileStatus", "user_chat_file");
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
    }
    else {
      this.router.navigateByUrl('login');
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
      chat.type = 'user_message';
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
        this.checkAdminStatus(chat);
      }
      //in case there is simple text message
      else {
        let text_message: string = chat.message;
        chat.message = text_message;
        const newMessage = firebase.database().ref('chats/').push();
        newMessage.set(chat);
        this.checkAdminStatus(chat);
      }
      this.ckContent = "";
      this.files = [];
      this.filesResponse = [];
      this.fileIsSelected = false;
      this.send_btn_enable = false;
    }
  }
  //chat multiple file selected code end

  checkAdminStatus(chat) {
    /*check if the admin is offline or whether the admin exist in orderuser or 
    not */
    firebase.database().ref('orderusers').orderByChild('orderid').equalTo(this.selectedOrderId).once('value', (snapshot: any) => {
      let orderuser = snapshotToArray(snapshot);
      const user = orderuser.find(x => x.nickname == "admin");
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

  submitCV(event) {
    this.selectedResume = event.target.files[0];
    this.formData.append("file", this.selectedResume);
  }

  submitQuestion() {
    this.formData.append("id", this.order.id);
    this.formData.append("answers", JSON.stringify(this.questionForm.value));
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let usertoken = localStorage.getItem("userToken");
    //in case we delete token from browser(Application)
    if (usertoken != null) {
      this.us.uploadAnswersFile(this.formData).subscribe((res) => {
        this.getOrder();
      },
        (error) => {
          console.log(error);
        })
    }
    else {
      this.router.navigateByUrl('login');
    }
  }

  updateOrderStatus(status) {
    let formData = new FormData;
    formData.append("id", this.selectedOrderId);
    if (status == "approve") {
      formData.append("status", "4");
      /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
      let usertoken = localStorage.getItem("userToken");
      //in case we delete token from browser(Application)
      if (usertoken != null) {
        this.as.updateOrder(formData).subscribe((res) => {
          this.getOrder();
        });
      }
      else {
        this.router.navigateByUrl('login');
      }
    }
    else {
      formData.append("status", "5");
      /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
      let usertoken = localStorage.getItem("userToken");
      //in case we delete token from browser(Application)
      if (usertoken != null) {
        this.as.updateOrder(formData).subscribe((res) => {
          this.getOrder();
        })
      }
      else {
        this.router.navigateByUrl('login');
      }
      //---------user revision code start---------//
      //open user revision model
      this.DraftSend = true;
      this.bsModalRef = this.modalService.show(UserRevisionComponent, { class: 'modal-dialog-centered', backdrop: 'static', keyboard: false, },);
      this.bsModalRef.content.closeBtnName = 'Close';
      let uploaded_files = [];
      //check if model gets submitted
      this.bsModalRef.onHidden.subscribe(() => {
        if (this.us.UserRevisionData.status == "submitted") {
          //check whether the file is selected or not
          if (this.us.UserRevisionData.files) {
            uploaded_files = this.us.UserRevisionData.files;
          }
          this.displayRevisionMessage(uploaded_files)
        }
        //to hide send first draft button and to make background normal 
        this.DraftSend = false;
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
    let text_message: string = chat.message;
    //check whether the file is selected or not
    if (uploaded_files.length >= 1) {
      this.checkAdminStatus(chat);
      let files_message;
      for (let i = 0; i < uploaded_files.length; i++) {
        if (i > 0) {
          files_message += "<a href='" + this.mediaUrl + "" + uploaded_files[i].file_path + "'target='_blank'>" + uploaded_files[i].file + "</a><br/>";
        }
        else {
          files_message = "<a href='" + this.mediaUrl + "" + uploaded_files[i].file_path + "'target='_blank'>" + uploaded_files[i].file + "</a><br/>";
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
      this.checkAdminStatus(chat);
    }
  }
  //---------user revision code end---------//
  openChat(btn)
  {
    this.enterChatRoom()
    $("#chat-box").css("visibility","visible"); 
    btn.style.visibility="hidden";
  }
  closeChat(btn) {
    this.exitChat();
    $("#chat-box").css("visibility","hidden");
    btn.style.visibility="visible";
  }
}