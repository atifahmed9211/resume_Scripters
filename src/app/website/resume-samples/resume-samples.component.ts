import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { WebsiteService } from '../website.service';
import { environment } from '../../../environments/environment';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-resume-samples',
  templateUrl: './resume-samples.component.html',
  styleUrls: ['./resume-samples.component.scss']
})

export class ResumeSamplesComponent implements OnInit {

  samples = [];
  categories = [];
  flag = 1;
  media_url = environment.mediaUrl;
  showLoading=true;

  constructor(
    private ws: WebsiteService
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.getSamples();
  }

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
    this.showLoading=false;
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
  getCategories() {
    this.ws.get_Samples_Category().subscribe((res) => {
      this.categories = res.categorys;
    })
  }
  getSamples() {
    this.ws.getSamples().subscribe((res) => {
      this.samples = res.samples;
      if (res) {
        this.Resume_sample();
      }
    })
  }
  stringifyToJSON(sample) {
    return JSON.parse(sample)
  }
}
