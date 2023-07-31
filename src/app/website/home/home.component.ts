import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { WebsiteService } from '../website.service';
import { environment } from '../../../environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { LoginCheckModalComponent } from '../shared-components/login-check-modal/login-check-modal.component';
import { FileUploadConfirmationComponent } from './file-upload-confirmation/file-upload-confirmation.component';
import { SubscribeModalComponent } from '../subscribe-modal/subscribe-modal.component';

declare var $;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  @ViewChild('file_upload') fileMessage: ElementRef;

  showLoader: boolean;
  mediaUrl = environment.mediaUrl;
  navbarClass = "navbar1";
  packages = [];
  blogs = [];
  public user = null;
  showModal = false;
  showLoading = false;
  showOne = false;
  showTwo = false;
  showThree = false;
  bsModalRef: BsModalRef;
  //Resume Sample variable start
  samples = [];
  categories = [];
  flag = 1;
  //Resume Sample variable end

  constructor(
    private webService: WebsiteService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService,
  ) {
  }

  ngOnInit() {
    //open subscribe dialog
    // this.bsModalRef = this.modalService.show(SubscribeModalComponent, {class: 'modal-dialog-centered'});
    // this.bsModalRef.content.closeBtnName = 'Close';
    AOS.init();
    this.getPackages();
    this.getBlogs();
    if (localStorage.getItem("user")) {
      this.user = JSON.parse(localStorage.getItem("user"))
    }
    this.getSamples();
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
            $this.text(Math.floor(countNum));
          },
          complete: (countNum) => {
            $this.text(countNum);
          }
        });
      });
    }
  }

  textOne(show) {
    if (show == 1) {
      this.showOne = !this.showOne
    } else if (show == 2) {
      this.showTwo = !this.showTwo
    } else {
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

  uploadResume(event) {
    this.webService.uploadedCVFile = event.target.files[0];
    //show get critique modal
    this.bsModalRef = this.modalService.show(LoginCheckModalComponent, { class: 'modal-dialog-centered', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.showModal = true;
    this.bsModalRef.onHidden.subscribe(() => {
      this.showModal = false;
      if (this.webService.critiqueTaskCompleted) {
        this.showLoader = true;
        //to disappear loader
        setTimeout(() => {
          this.showLoader = false;
          this.webService.critiqueTaskCompleted = false;
          this.bsModalRef = this.modalService.show(FileUploadConfirmationComponent, { class: 'modal-dialog-centered' });
          this.bsModalRef.content.closeBtnName = 'Close';
          this.showModal = true;
          this.bsModalRef.onHidden.subscribe(() => {
            this.showModal = false;
          });
        }, 3500)
      }
    }),
      this.fileMessage.nativeElement.value = null //to select same file twice
  }

  getPackages() {
    this.webService.getAllPackages("Private Sector").subscribe((res) => {
      this.packages = res.packages;
    },
      (error) => {
        console.log(error);
      })
  }

  getBlogs() {
    this.webService.getAllBlogs().subscribe((res) => {
      this.blogs = res.blogs;
    },
      (error) => {
        console.log(error);
      })
  }

  BuyNow(pkgId) {
    for (let pkg of this.packages) {
      if (pkg.id == pkgId) {
        //in case user reload page then to save data as a backup
        localStorage.setItem("selectedPackage", JSON.stringify(pkg))
      }
    }
    if (this.user) {
      this.router.navigate(['./checkout'])
    }
    else {
      this.router.navigate(['./login'])
      this.webService.redirecting_url = "./checkout";

    }
  }

  //Resume Sample Code start
  changeImage(ele_id, pics) {
    let firstElement = document.getElementById(ele_id + pics[0]);
    let secondElement = document.getElementById(ele_id + pics[1]);
    if (this.flag) {
      firstElement.style.zIndex = "0";
      secondElement.style.zIndex = "1";
      this.flag = 0
    }
    else {
      firstElement.style.zIndex = "1";
      secondElement.style.zIndex = "0";
      this.flag = 1;
    }
  }

  Resume_sample() {
    setTimeout(() => {
      let list = document.querySelectorAll(".list");
      let itemBox = document.querySelectorAll(".itembox");
      let boxFancy = document.querySelectorAll(".fancybox");
      for (let i = 0; i < list.length; i++) {
        list[i].addEventListener("click", function () {
          for (let j = 0; j < list.length; j++) {
            list[j].classList.remove("active");
          }
          this.classList.add("active");
          let dataFilter = this.getAttribute("id");

          for (let k = 0; k < itemBox.length; k++) {
            itemBox[k].classList.remove("active");
            itemBox[k].classList.add("hide");
            if (
              itemBox[k].getAttribute("id") == dataFilter ||
              dataFilter == "all"
            ) {
              itemBox[k].classList.remove("hide");
              itemBox[k].classList.add("active");
            }
          }
          for (let m = 0; m < boxFancy.length; m++) {
            boxFancy[m].classList.remove("active");
            this.Fancybox.bind("[data-fancybox].active", {
              groupAll: false
            });
            if (
              boxFancy[m].getAttribute("data-item") == dataFilter ||
              dataFilter == "all"
            ) {
              boxFancy[m].classList.add("active");
              this.Fancybox.bind("[data-fancybox].active", {
                groupAll: true
              });
            }
          }
        });
      }
    }, 1000)
  }
  getSamples() {
    this.webService.getSamples().subscribe((res) => {
      if (res) {
        //to get first 4 sample
        for (let i = 0; i < 4; i++) {
          this.samples.push(res.samples[i]);
        }
        //jo first 4 samples select kiye ha,, sirf inke categories select karne ha,
        this.getCategories();
        this.Resume_sample();
      }
    })
  }
  getCategories() {
    this.webService.get_Samples_Category().subscribe((res) => {
      if (res) {
        for (let item of res.categorys) {
          for (let sample of this.samples) {
            if (item.id == sample.category) {
              this.categories.push(item);
            }
          }
        }
      }
    })
  }
  stringifyToJSON(sample) {
    return JSON.parse(sample)
  }
  //Resume Sample Code End
  getTrimText(text, length) {
    var words = text.split(" ")
    var trimmedText = "";
    if (words.length > length) {
      for (let i = 0; i < length; i++) {
        trimmedText += words[i] + " ";
      }
      trimmedText += ".....";
    }
    else {
      trimmedText = text;
    }
    return trimmedText;
  }

  getSpecificBlog(id) {
    this.webService.getBlogById(id).subscribe((res) => {
      localStorage.setItem("selected_blog", JSON.stringify(res.blog));
      if (res) {
        this.router.navigate(["/blog-detail/" + id])
      }
    },
      (error) => {
        console.log(error);
      })
  }
}
