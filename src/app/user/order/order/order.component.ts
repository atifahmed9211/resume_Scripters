import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminService } from '../../../admin/admin.service';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform} from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

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
@Pipe({ name: 'safe' })
export class OrderComponent implements OnInit,PipeTransform {
  //for firebase
  nickname = '';
  orders = [];
  isLoadingResults = true;
  chats = [];
  users = [];
  public questionaire_answer=null;

  @ViewChild('orderTabs', { static: false }) orderTabs: TabsetComponent;
  @ViewChild('chatcontent') chatcontent: ElementRef;
  @ViewChild('textAreaMessage') text_Area_Message!: ElementRef<HTMLTextAreaElement>
  scrolltop: number = null;

  public order = null;
  public questionnaireFIle = null;
  public mediaUrl = environment.mediaUrl;
  public showQuestionForm: boolean = true;
  public showAnswerForm:boolean=false;
  constructor(
    private route: ActivatedRoute,
    private us: UserService,
    private as: AdminService,
    public datepipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {
    this.nickname = localStorage.getItem('nick name');
    console.log("nick name = ", this.nickname);
    let orderId = this.route.snapshot.paramMap.get("id");
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
    firebase.database().ref('orderusers/').orderByChild('orderid').equalTo(orderId).on('value', (resp2: any) => {
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

  getOrder() {
    this.CreateOrderInFireBase();
    console.log("get order mathed called");
    let id = this.route.snapshot.paramMap.get("id");
    this.us.getOrderById(id).subscribe((res) => {
      console.log(res);
      this.order = res.order;
      this.questionaire_answer=JSON.parse(this.order.answers);
      if (this.order.status == "Questionnaire Completed") {
        this.showQuestionForm = false;
        this.showAnswerForm=true;
      }
      if (this.order.status != "Questionnaire Completed") {
        this.orderTabs.tabs[1].disabled = true;
        this.orderTabs.tabs[2].disabled = true;
      } else {
        this.orderTabs.tabs[1].disabled = false;
        this.orderTabs.tabs[2].disabled = false;
      }
    },
      (error) => {
        console.log(error);
      })
  }
  enterChatRoom() {
    let orderId = this.route.snapshot.paramMap.get("id");
    const chat = { orderId: '', nickname: '', type: '' };
    chat.orderId = orderId;
    chat.nickname = this.nickname;
    chat.type = 'join';
    const newMessage = firebase.database().ref('chats/').push();
    newMessage.set(chat);

    firebase.database().ref('orderusers/').orderByChild('orderid').equalTo(orderId).on('value', (resp: any) => {
      let orderuser = [];
      orderuser = snapshotToArray(resp);
      const user = orderuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = firebase.database().ref('orderusers/' + user.key);
        userRef.update({ status: 'online' });
      } else {
        const newOrderUser = { orderid: '', nickname: '', status: '' };
        newOrderUser.orderid = orderId;
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
  uploadMessagefile;
  base64string: FileReader;
  fileIsSelected=false;
  uploadFile(event) {
    this.send_btn_enable=true;
    this.fileIsSelected=true;
    this.uploadMessagefile = event.target.files[0];
    this.getBase64(this.uploadMessagefile);
    this.text_Area_Message.nativeElement.value = this.uploadMessagefile.name;
    this.text_Area_Message.nativeElement.disabled=true;
  }
  //convert file into base 64
  reader = new FileReader();
  getBase64(file) {
    this.reader.readAsDataURL(file);
    this.reader.onload = function () {

    };
    this.reader.onerror = function (error) {
      console.log('Error: ', error);
    };
}
  sendMessage(form: any) {
    if(this.send_btn_enable )
    {
      this.text_Area_Message.nativeElement.disabled=false;
    console.log("send message method called");
    let orderId = this.route.snapshot.paramMap.get("id");
    const chat = form;
    chat.orderId = orderId;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    if(this.fileIsSelected)
    {
      chat["attachFile"] = this.reader.result;
      chat.fileName=this.uploadMessagefile.name;
      chat["message"]=null;
    }
    console.log("chat", chat);
    const newMessage = firebase.database().ref('chats/').push();
    newMessage.set(chat);
    this.text_Area_Message.nativeElement.value = null;
    this.fileIsSelected=false;
    this.send_btn_enable=false;
    }
  }
  send_btn_enable=false;
  send_btn_class(event:Event)
  { 
    let entered_values;
    entered_values=(<HTMLTextAreaElement>event.target).value;
    if(entered_values)
    {
      this.send_btn_enable=true
    }
    else{
      this.send_btn_enable=false;
    } 
  }
  DownloadMessageFile(readerresult,file_Name) {
    const linkSource = readerresult;
    const downloadLink = document.createElement("a");
    const fileName = file_Name;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
  questionForm: FormGroup = new FormGroup({
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
  submitCV(event) {
    this.formData.append("file", event.target.files[0]);
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
}
