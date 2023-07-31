import { Component, OnInit, HostListener } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WebsiteService } from '../website.service';
import { Router } from '@angular/router';

declare var $;

@Component({
  selector: 'app-resume-services',
  templateUrl: './resume-services.component.html',
  styleUrls: ['./resume-services.component.scss']
})

export class ResumeServicesComponent implements OnInit {

  services = [];
  packages = [];
  bsModalRef: BsModalRef;
  amount = null;
  public user = null;
  showLoader = true;
  flag = 1; //make sure get paragraph method should be called one time.

  constructor(
    private webService: WebsiteService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getPackages();
    this.getServices();
    if (localStorage.getItem("user")) {
      this.user = JSON.parse(localStorage.getItem("user"))
    }
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.getParagraphText();
  }

  getParagraphText() {
    var oTop;
    var self = this; //to access typescript class variable.
    var referenceTop; //to check whether we have cross our element or not.

    //declaration
    if ($('.counterUp').length !== 0) {
      oTop = $('.counterUp').offset().top - window.innerHeight;
    }
    if ($('.reference_bottom').length !== 0) {
      referenceTop = $('.reference_bottom').offset().top - window.innerHeight;
    }
    //if we are scrolling within our element
    if ($(window).scrollTop() > oTop && $(window).scrollTop() < referenceTop && self.flag) {
      //starting me paragraph ke words ko kam karne ke lye  
      self.getTrimText();
      self.flag = 0;
    }
    //if we have crossed our element
    else if ($(window).scrollTop() > referenceTop + 400) {
      self.getTrimText();
      self.flag = 1;
    }
    //if we are moving upward
    else if ($(window).scrollTop() < oTop && $(window).scrollTop() < referenceTop) {
      self.getTrimText();
      self.flag = 1;

    }
    else {
      //self.flag = 1;
    }
  }

  getTrimText() {
    var total_paragraph = $('.counterUp');
    for (let i = 0; i < total_paragraph.length; i++) {
      var text = ($(total_paragraph[i]).text());
      var trimmed_text = $.trim(text);
      var words = trimmed_text.split(" ")
      var trimmedText = "";
      for (let i = 0; i < 30; i++) {
        trimmedText += words[i] + " ";
      }
      trimmedText += ".....";
      $(total_paragraph[i]).text("");
      $(total_paragraph[i]).text(trimmedText);
      $(total_paragraph[i]).css({ overflow: 'hidden' })  //to make read more button visible 
    }
  }

  buyService(id) {
    if (this.user) {
      this.router.navigate(['./checkout'])
      for (let service of this.services) {
        if (service.id == id) {
          //in case user reload page then to save data as a backup
          localStorage.setItem("selectedPackage", JSON.stringify(service))
        }
      }
    }
    else {
      this.router.navigate(['./login'])
    }
  }

  buyPackage(id) {
    if (this.user) {
      this.router.navigate(['./checkout'])
      for (let pkg of this.packages) {
        if (pkg.id == id) {
          //in case user reload page then to save data as a backup
          localStorage.setItem("selectedPackage", JSON.stringify(pkg))
        }
      }
    }
    else {
      this.router.navigate(['./login'])
    }
  }
  
  getServices() {
    this.webService.getAllServices("Private Sector").subscribe((res) => {
      this.services = res.service[0].services;
    },
      (error) => {
        console.log(error);
      })
  }

  getPackages() {
    this.webService.getAllPackages("Private Sector").subscribe((res) => {
      this.packages = res.packages;
      if (res) {
        this.showLoader = false;
      }
    },
      (error) => {
        console.log(error);
      })
  }
  
  ReadMore(parent, element, text) {
    var txt = text;
    var words = txt.split(" ")
    element.style.overflow = "visible";
    element.style.height = "auto";
    element.innerHTML = "";
    for (let i = 0; i < words.length; i++) {
      element.innerHTML += words[i] + " ";
    }
    parent.style.height = "auto";
  }
}
