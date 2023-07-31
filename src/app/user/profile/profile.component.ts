import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { environment } from '../../../environments/environment';
import { WebsiteService } from '../../website/website.service';

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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  @ViewChild('fileMessage') fileMessage: ElementRef;
  @ViewChild('new_password') newPassword: ElementRef;
  @ViewChild('confirm_password') confirmPassword: ElementRef;
  @ViewChild('passwordMatchParagraph') passwordMatchParagraph: ElementRef;

  profile_form: FormGroup = new FormGroup({
    user_name: new FormControl(localStorage.getItem("nick name"), [Validators.required]),
    previous_password: new FormControl('', [Validators.required]),
    newCode: new FormControl('', [Validators.required]),
    confirmCode: new FormControl('', Validators.required)
  })

  disableForm = true;
  public user = null;
  selectedProfilePic;
  fullNameArray;
  firstTwoLetter;
  mediaURL = environment.mediaUrl;
  showProfile = true;
  changePasswordField = false;
  old_password_response;
  passwordMismatch=false; //to disable submit button
  validImage = true;
  selectedProfilePicName; 

  constructor(
    public us: UserService,
    public route: Router,
    public router: ActivatedRoute,
    private webService: WebsiteService,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem("user")) {
      this.user = JSON.parse(localStorage.getItem("user"))
      this.fullNameArray = this.user.name.split(' ');
      if (this.fullNameArray.length >= 2) {
        this.firstTwoLetter = this.fullNameArray[0].slice(0, 1).toUpperCase() + this.fullNameArray[1].slice(0, 1).toUpperCase();
      }
      else {
        this.firstTwoLetter = this.fullNameArray[0].slice(0, 1).toUpperCase();
      }
    }
  }

  editProfile() {
    this.disableForm = false;
    setTimeout(() => {
      window.scroll(0, document.body.scrollHeight); //for main window
    }, 100)
  }

  changePassword() {
    this.changePasswordField = true;
  }

  validatePassword() {
    if (this.newPassword.nativeElement.value && this.confirmPassword.nativeElement.value) {
      if (this.newPassword.nativeElement.value == this.confirmPassword.nativeElement.value) {
        this.passwordMatchParagraph.nativeElement.innerHTML = "Password Matched!";
        this.passwordMatchParagraph.nativeElement.style.color = "green";
        this.passwordMismatch=false;
      }
      else {
        this.passwordMatchParagraph.nativeElement.innerHTML = "Password MisMatched!";
        this.passwordMatchParagraph.nativeElement.style.color = "red";
        this.passwordMismatch=true;
      }
    }
    else {
      this.passwordMatchParagraph.nativeElement.innerHTML = null;
    }
  }

  showPassword(element) {
    if (element.type == 'password') {
      element.type = 'text';
    }
    else {
      element.type = 'password';
    }
  }
  
  //to enable or disable submit button,, upload image is not necessay that's why 
  //we are giving its value true; in case user select an invalid file then we will
  // not show that file name.. and also we will assign a null value to  our 
  // selectedProfilepic variable 
  uploadProfilePic(event) {
    this.selectedProfilePic = event.target.files[0];
    var allowedExtension = ['jpeg', 'jpg', 'png'];
    //yeh method onchange par call ho raha ha,,, it means user file select kare 
    //ga to bhe yeh method call ho ga or agar user simple choose file par click 
    //karta ha.. lakin file choose nahe karta to phir bhe yeh method call ho ga,,,
    if (this.selectedProfilePic) {
      var fileExtension = this.selectedProfilePic.name.split('.').pop().toLowerCase();
      for (let extension of allowedExtension) {

        if (fileExtension === extension) {
          this.validImage = true;
          this.selectedProfilePic = event.target.files[0];
          this.selectedProfilePicName = this.selectedProfilePic.name;
          break;
        }
        else {
          this.validImage = false;
          this.selectedProfilePic = null;
          this.selectedProfilePicName = null;
        }
      }
    }
    else {
      console.log("");
    }
  }

  updateProfile() {
    this.showProfile = false; //for loading screen
    let formData = new FormData();
    formData.append("name", this.profile_form.value.user_name);
    if (this.selectedProfilePic) {
      formData.append("picture", this.selectedProfilePic);
    }
    //in case user want to change password
    if (this.changePasswordField) {
      if (this.newPassword.nativeElement.value && this.confirmPassword.nativeElement.value) {
        if (this.newPassword.nativeElement.value == this.confirmPassword.nativeElement.value) {
          formData.append("password", this.profile_form.value.previous_password);
          formData.append("new_password", this.newPassword.nativeElement.value);
        }
      }
    }
    this.us.updateProfile(formData).subscribe((res) => {
      if (res.status == 200) {
        //remove old user name and user detail from local storage
        localStorage.removeItem("user");
        localStorage.removeItem('nick name');
        //update user detail
        localStorage.setItem("nick name", res.user.name);
        localStorage.setItem("user", JSON.stringify(res.user));
        this.UpdateUserInFirebase()
        //update user token in local storage
        let user={
          "email":res.user.email,
          "password":formData.get('new_password')
        }
        if (this.changePasswordField) {
          this.webService.login(user).subscribe((res) => {
            localStorage.setItem("userToken", res.token);
        });
      }
    }
      else {
        console.log("");
      }
    },
    (error)=>{
      console.log(error.error);
      this.showProfile = true; //for disable loading screen
      this.disableForm=false; //to show form
      this.old_password_response=error.error;
    }
    );
    this.disableForm = true;
  }

  resetErrorResponse()
  {
    this.old_password_response=null;
  }

  UpdateUserInFirebase() {
    setTimeout(() => {
      let nick_name = localStorage.getItem("nick name");
      let email = this.user.email;
      let ref = firebase.database().ref('users/');
      ref.orderByChild("email").equalTo(email).once('value', snapshot => {
        if (snapshot.exists()) {
          let previousUser = snapshotToArray(snapshot);
          const user = previousUser.find(x => x.email === email);
          const userRef = firebase.database().ref('users/' + user.key);
          userRef.update({ nickname: nick_name });
          this.pageRefresh();
        } else {
          console.log("");
        }
      });
    }, 2000)
  }

  pageRefresh() {
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate(['./'], {
      relativeTo: this.router
    })
  }

  deleteItem(i) {
    this.selectedProfilePic = null;
    this.selectedProfilePicName = null;
    this.fileMessage.nativeElement.value = null; //in case user want to select the same file after deselecting.
  }

  get user_name() {
    return this.profile_form.get('user_name');
  }

  get previous_password() {
    return this.profile_form.get('previous_password');
  }

  get newCode() {
    return this.profile_form.get('newCode');
  }

  get confirmCode() {
    return this.profile_form.get('confirmCode');
  }
  
}