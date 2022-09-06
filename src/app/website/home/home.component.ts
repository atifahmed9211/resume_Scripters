import { Component, Input, OnInit, EventEmitter,HostListener,ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { WebsiteService } from '../website.service';
import { environment } from '../../../environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { LoginCheckModalComponent } from '../shared-components/login-check-modal/login-check-modal.component';
import { HomeServiceService} from '../../services/home-service.service'
import { CircleProgressOptions } from 'ng-circle-progress';

declare var $;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('circleProgress') circleProgressbar!:ElementRef<CircleProgressOptions>;
  showLoader:boolean;
  mediaUrl    = environment.mediaUrl;
  homeLogo    = "./../../../assets/images/headerlogo.png";
  navbarClass = "navbar1";
  packages    = [];
  blogs       = [];
  public user = null;

  constructor(
    private webService  : WebsiteService,
    private router      : Router,
    private toastr      : ToastrService,
    private modalService: BsModalService,
    private homeData:HomeServiceService
  ) { 
    this.showLoader=homeData.showLoader;
  }
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
        this.bsModalRef = this.modalService.show(LoginCheckModalComponent, {class: 'modal-dialog-centered'});
        this.bsModalRef.content.closeBtnName = 'Close';
      },
      (error)=>{
        console.log(error);
        this.toastr.error('Resume Upload Failed', 'Error');
      })
    }else{
      // this.router.navigateByUrl("register");
      console.log(document.getElementById('circleProgress'));
      console.log(this.circleProgressbar);
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
    if(localStorage.getItem("user")){
      this.user = JSON.parse(localStorage.getItem("user"))
    }  
  }
  BuyNow(pkgId)
  {
    if(this.user)
    {
      this.router.navigate(['./checkout'])
      console.log("package id",pkgId);
      for(let pkg of this.packages)
      {
        if(pkg.id==pkgId)
        {
          this.webService.selectedPackage=pkg;
        }
      }
    }
    else{
      this.router.navigate(['./login'])
    }
  }
}
