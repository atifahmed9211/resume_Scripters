import { Component, Input, OnInit, HostListener } from '@angular/core';
declare var $;
@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {

  navbarClass = "navbar2";
  constructor() { }
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
            $this.text(Math.floor(countNum)+'+');
          }
        });
      });
    }
    
     
  }
  ngOnInit() {
  }

}
