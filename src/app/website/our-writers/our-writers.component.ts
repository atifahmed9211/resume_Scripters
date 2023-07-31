import { Component, Input, OnInit,HostListener } from '@angular/core';

declare var $;

@Component({
  selector: 'app-our-writers',
  templateUrl: './our-writers.component.html',
  styleUrls: ['./our-writers.component.scss']
})

export class OurWritersComponent implements OnInit {
  
  constructor() { }
  
  ngOnInit() {
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
            countNum = Math.floor(countNum);
            var word = $this.attr("data-word"); 
            $this.text(`${countNum}+ ${word}`);
          },
          // complete: (countNum) => {
          //   $this.text(`${countNum}+`);
          // }
        });
      });
    }
  }
}
