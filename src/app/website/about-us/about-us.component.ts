import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})

export class AboutUsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.slideSlider();
  }

  //logo icon slider
  slideSlider(){
    $("#slider-scroller").css({"left":"0%","transition":"all 0s linear"});
    $("#slider-scroller").css({"left": String(parseInt($("#slider-scroller").css("left")) - 500) + "px","transition":"all 5s linear"});
    setTimeout(()=>{
      this.moveSliderItem()
    },2635);
  }
  
  moveSliderItem(){
    $("#slider-scroller div").first().detach().appendTo($("#slider-scroller"));
    this.slideSlider();
  }
}
