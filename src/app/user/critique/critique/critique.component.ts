import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../user.service';
import { ResumeModel } from "../critique/model/resume.model";
import * as AOS from 'aos';
import { Router } from '@angular/router';
import { WebsiteService } from '../../../website/website.service';

declare var $;

@Component({
  selector: 'app-critique',
  templateUrl: './critique.component.html',
  styleUrls: ['./critique.component.scss']
})

export class CritiqueComponent implements OnInit {
  
  public critique = null;
  public Brevity_Impact_Depth: Array<ResumeModel>
  public brevity = null;
  public impact = null;
  public depth = null;
  public users = null;
  public mediaUrl = environment.mediaUrl;
  public circle_color: any = ["rgb(26, 204, 184)", "rgb(16, 105, 224)", "rgb(7, 200, 248)"];
  packages = [];
  public user = null;
  public showCritique=false;
  public static a = -1;
  public circle_background_color;
  percentage;  //to avoid infinite loop
  rotation; //to avoid infinite loop
  wordCountFlag = 1 //to stop word count again and again
  fileSizeCountFlag = 1 //to stop word count again and again

  constructor(
    private route: ActivatedRoute,
    private us: UserService,
    private router: Router,
    private webService: WebsiteService,
  ) {
  }

  ngOnInit(): void {
    AOS.init();
    this.getCritique();
    this.getPackages();
    if (localStorage.getItem("user")) {
      this.user = JSON.parse(localStorage.getItem("user"))
    }
  }

  getPackages() {
    this.webService.getAllPackages("Private Sector").subscribe((res) => {
      this.packages = res.packages;
    },
      (error) => {
        console.log(error);
      })
  }

  getCritique() {
    let id = this.route.snapshot.paramMap.get("id");
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let usertoken = localStorage.getItem("userToken");
    //in case we delete token from browser(Application)
    if (usertoken != null) {
      this.us.getCritiqueById(id).subscribe((res) => {
        if (res) {
          this.showCritique=true;
          this.critique = res.critique;
          this.brevity = this.critique.brevity;
          this.impact = this.critique.impact;
          this.depth = this.critique.depth;
          this.users = this.critique.users;
          this.initializeBrevity()
          this.getPercentage();
          this.getTransformRotation();
        }
      },
        (error) => {
          console.log(error)
        });
    }
    else {
      this.router.navigateByUrl('login');
    }
  }

  initializeBrevity() {
    this.Brevity_Impact_Depth = [
      { Value: parseInt(this.brevity), Color: '#f2ac03', Size: '', Legend: 'Brevity' },
      { Value: parseInt(this.impact), Color: '#106eed', Size: '', Legend: 'Impact' },
      { Value: parseInt(this.depth), Color: '#0fe1c9', Size: '', Legend: 'Depth' },
    ];
  }
  
  getCircleColor(index) {
    if (index == 0) {
      CritiqueComponent.a = -1
    }
    CritiqueComponent.a++;
    if (CritiqueComponent.a == 3) {
      CritiqueComponent.a = 0;
    }
    this.circle_background_color = this.circle_color[CritiqueComponent.a];
    return this.circle_background_color;
  }

  getPercentage() {
    this.percentage = (this.critique.word_count / 1730) * 100;
    if (this.percentage >= 98) {
      this.percentage = "98%";
    }
    else {
      this.percentage = this.percentage + "%";
    }
  }

  getTransformRotation() {
    let file_size = this.critique.file_size;
    if (file_size < 600) {
      this.rotation = (file_size / 600) * 200;
    }
    else {
      this.rotation = 180;
    }
    this.rotation = this.rotation + "deg";
  }

  BuyNow(pkgId) {
    if (this.user) {
      this.router.navigate(['./checkout'])
      for (let pkg of this.packages) {
        if (pkg.id == pkgId) {
          //in case user reload page then to save data as a backup
          localStorage.setItem("selectedPackage", JSON.stringify(pkg))
        }
      }
    }
    else {
      this.router.navigate(['./login'])
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    //window scroll ke oper word count graph work kare,
    this.wordCountGraph();
    //window scroll ke oper file size meter work kare,
    this.fileSizeMeter();
  }

  wordCountGraph() {
    var oTop;
    var self = this; //to access typescript class variable.
    var referenceTop; //to check whether we have cross our element or not.

    //declaration
    if ($('.word-graph-marker').length !== 0) {
      oTop = $('.word-graph-marker').offset().top - window.innerHeight;
    }
    if ($('.reference_bottom').length !== 0) {
      referenceTop = $('.reference_bottom').offset().top - window.innerHeight;
    }
    //in case we scroll down page till our specific element
    if ($(window).scrollTop() > oTop && $(window).scrollTop() < referenceTop) {
      //word count graph
      $('.word-graph-marker').each(function () {
        $(".word-graph-marker").parent().css({ position: 'relative' });
        $(".word-graph-marker").css({ left: self.percentage, position: 'absolute', transition: 'all 5s ease' });
      });
      //window scroll ke oper Total no of words bhe animate ho.
      if (self.wordCountFlag) {
        $('.counterUp').each(function (i, val) {
          var $this = $(this),
            countTo = self.critique.word_count;
          $({
            countNum: 0
          }).animate({
            countNum: countTo
          }, {
            duration: 2000,
            easing: 'swing',
            step: (countNum) => {
              $this.text(Math.floor(countNum));
            },
            complete: (countNum) => {
              $this.text(countNum);
            }
          });
        });
        self.wordCountFlag = 0;
      }
    }
    //in case we further move down.
    else if ($(window).scrollTop() > referenceTop) {
      $(".word-graph-marker").parent().css({ position: 'relative' });
      $(".word-graph-marker").css({ left: 0, position: 'absolute', transition: 'none' });
      self.wordCountFlag = 1;
    }
    //in case we scroll page up.
    else {
      $(".word-graph-marker").parent().css({ position: 'relative' });
      $(".word-graph-marker").css({ left: 0, position: 'absolute', transition: 'none' });
      self.wordCountFlag = 1;
    }
  }
  
  fileSizeMeter() {
    var oTop;
    var self = this; //to access typescript class variable.
    var referenceTop; //to check whether we have cross our element or not.

    //declaration
    if ($('.needle').length !== 0) {
      oTop = $('.needle').offset().top - window.innerHeight;
    }
    if ($('.reference_bottom').length !== 0) {
      referenceTop = $('.reference_bottom').offset().top - window.innerHeight;
    }
    //in case we scroll down page till our specific element
    if ($(window).scrollTop() > oTop && $(window).scrollTop() < referenceTop) {
      //file size meter
      $('.needle').each(function () {
        $(".needle").parent().css({ position: 'relative' });
        $(".needle").css({ transform: "rotate(" + self.rotation + ")", position: 'absolute', transition: 'all 5s ease' });
      });
      //window scroll ke oper Total no of words bhe animate ho.
      if (self.fileSizeCountFlag) {
        $('.counterUpp').each(function () {
          var $this = $(this),
            countTo = self.critique.file_size;
          $({
            countNum: 0
          }).animate({
            countNum: countTo
          }, {
            duration: 2000,
            easing: 'swing',
            step: (countNum) => {
              $this.text(Math.floor(countNum));
            },
            complete: (countNum) => {
              $this.text(countNum);
            }
          });
        });
        self.fileSizeCountFlag = 0;
      }
    }
    //in case we further move down.
    else if ($(window).scrollTop() > referenceTop) {
      $(".needle").parent().css({ position: 'relative' });
      $(".needle").css({ transform: 'rotate(0deg)', position: 'absolute', transition: 'none' });
      self.fileSizeCountFlag = 1;
    }
    //in case we scroll page up.
    else {
      $(".needle").parent().css({ position: 'relative' });
      $(".needle").css({ transform: 'rotate(0deg)', position: 'absolute', transition: 'none' });
      self.fileSizeCountFlag = 1;
    }
  }
}