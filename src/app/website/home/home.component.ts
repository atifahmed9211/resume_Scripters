import { Component, Input, OnInit, EventEmitter,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { WebsiteService } from '../website.service';
import { environment } from '../../../environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { LoginCheckModalComponent } from '../shared-components/login-check-modal/login-check-modal.component';
declare var $;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  mediaUrl    = environment.mediaUrl;
  homeLogo    = "./../../../assets/images/headerlogo.png";
  navbarClass = "navbar1";
  packages    = [];
  blogs       = [];
  
  constructor(
    private webService  : WebsiteService,
    private router      : Router,
    private toastr      : ToastrService,
    private modalService: BsModalService,
  ) { }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    var oTop;
    // var countNum = 0;
    if ($('.counterUp').length !== 0) {
      oTop = $('.counterUp').offset().top - window.innerHeight;
    }
    if ($(window).scrollTop() > oTop) {
      $('.counterUp').each(function () {
        var $this = $(this),
        countTo = $this.attr('data-count');
        $({
          countNum: 0
        }).animate({
          countNum: countTo
        }, {
          duration: 1000,
          easing: 'swing',
          step: (countNum) => {
            console.log(countNum);
            $this.text(Math.floor(countNum));
          },
          complete: (countNum) => {
            $this.text(countNum);
          }
        });
      });
    }
    
     
  }

  showOne = false;
  showTwo = false;
  showThree = false;
  bsModalRef: BsModalRef;

  textOne(show){
    if(show==1){
      this.showOne = !this.showOne
    }else if(show == 2){
      this.showTwo = !this.showTwo
    }else{
      this.showThree = !this.showThree
    }
  }

  // Count Up
  
  counter() {
    var oTop;
    var countNum;
    if ($('.counterUp').length !== 0) {
      oTop = $('.counterUp').offset().top - window.innerHeight;
    }
    if ($(window).scrollTop() > oTop) {
      $('.counterUp').each(function () {
        var $this = $(this),
          countTo = $this.attr('data-count');
        $({
          countNum: $this.text()
        }).animate({
          countNum: countTo
        }, {
          duration: 1000,
          easing: 'swing',
          step: () => {
            $this.text(Math.floor(this.countNum));
          },
          complete: () => {
            $this.text(this.countNum);
          }
        });
      });
    }
  }

  uploadResume(event){
    if(localStorage.getItem("userToken")){
      let formData = new FormData();
      formData.append("file",event.target.files[0]);
      this.webService.createCritique(formData).subscribe((res)=>{
        console.log(res);
        this.toastr.success('Resume Uploaded Successfully', 'Success');
      },
      (error)=>{
        console.log(error);
        this.toastr.error('Resume Upload Failed', 'Error');
      })
    }else{
      // this.router.navigateByUrl("register");
      this.bsModalRef = this.modalService.show(LoginCheckModalComponent, {class: 'modal-dialog-centered'});
      this.bsModalRef.content.closeBtnName = 'Close';
    }
  }

  getPackages(){
    this.webService.getAllPackages("Private Sector").subscribe((res)=>{
      console.log(res);
      this.packages = res.packages;
    },
    (error)=>{
      console.log(error);
    })
  }

  getBlogs(){
    this.webService.getAllBlogs().subscribe((res)=>{
      console.log(res);
      this.blogs = res.blogs;
    },
    (error)=>{
      console.log(error);
    })
  }

  ngOnInit() {
    AOS.init();
    this.getPackages();
    this.getBlogs();
  }

}
