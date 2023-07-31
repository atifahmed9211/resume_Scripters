import { Component, OnInit } from '@angular/core';
import { navItems } from './_nav';
import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';

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
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [IconSetService],
})
export class UserComponent implements OnInit {

  webUrl=environment.webUrl;
  username: any;
  public user = null;

  public sidebarMinimized = false;
  public navItems = navItems;
  pending_chat = [];

  constructor(
    public iconSet: IconSetService,
    public router: Router,
    public us: UserService
  ) {
    // iconSet singleton
    iconSet.icons = { ...freeSet };
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  public logout(): void {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    this.router.navigateByUrl('');
  }
  flag = -1;
  ngOnInit(): void {
    if (localStorage.getItem("user")) {
      this.user = JSON.parse(localStorage.getItem("user"))
      // to display username in html page
      this.username = this.user.name;

      /* whenever our application start then at that time there would be no
      users in ordersusers in firebase.*/
      this.removeOrderUser();

      /*whenever our application start then at that time we may have some pending
      messages, so to get that list of pending message we would call following 
      method and we also need a flag value to determine that it's our first call,,
      and after that we will also check whenever there is a new pending message.. */
      this.getPendingChat();
    }
  }

  removeOrderUser() {
    let temp = [];
    firebase.database().ref('orderusers').once('value', resp => {
      temp = snapshotToArray(resp);
      for (let item of temp) {
        if (item.nickname != "admin") {
          const userRef = firebase.database().ref("orderusers/" + item.key)
          userRef.remove();
        }
      }
    })
  }

  //here we are getting pending messages,,,
  getPendingChat() {
    let temp = [];
    let total_message_length;
    firebase.database().ref('pending_chat/').on('value', resp => {
      if (this.flag == -1) {
        this.pending_chat = [];
        //here we getting complete chat including all orders.
        temp = snapshotToArray(resp);
        //getting total user message
        total_message_length = temp.length;
        for (let item of temp) {
          if (item.type == "admin_message" || item.type=="firstDraftMessage" || item.type=="adminRevisionMessage" || item.type=="finalDraftMessage") {
            this.pending_chat.push(item)
          }
        }
        this.flag = 0;
      }
      //whenever we delete message,
      else if (snapshotToArray(resp).length <= total_message_length) {
        let temp = snapshotToArray(resp)
        this.pending_chat = [];
        for (let item of temp) {
          if (item.type == "admin_message") {
            this.pending_chat.push(item);
          }
        }
        total_message_length = snapshotToArray(resp).length;
      }
      //the following code will be executed every time whenever there is a new pending message.
      else {
        total_message_length = snapshotToArray(resp).length;
        let total_pending_messages = snapshotToArray(resp);
        let new_message = total_pending_messages[total_pending_messages.length - 1];
        if (new_message.type == "admin_message" || new_message.type=="firstDraftMessage" || new_message.type=="adminRevisionMessage" || new_message.type=="finalDraftMessage") {
          this.pending_chat.push(new_message);
          //play notification sound.
          let audio: HTMLAudioElement = new Audio('https://drive.google.com/uc?export=download&id=1M95VOpto1cQ4FQHzNBaLf0WFQglrtWi7');
          audio.play();
        }
      }
    })
  }
  openLink()
  {
    
  }
}
