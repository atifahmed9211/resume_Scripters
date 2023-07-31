import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResumeSampleService } from '../../resume-sample.service';
import { environment } from '../../../../../environments/environment';
import { WebsiteService } from '../../../../website/website.service';

@Component({
  selector: 'app-samples-detail',
  templateUrl: './samples-detail.component.html',
  styleUrls: ['./samples-detail.component.scss']
})
export class SamplesDetailComponent implements OnInit {

  selected_sample;
  selected_sample_pics;
  media_url=environment.mediaUrl;
  getSamplesData=false; //to show loader
  categories=[];

  constructor(
    private route:ActivatedRoute,
    private rs:ResumeSampleService,
    private ws:WebsiteService
  ) { }

  ngOnInit(): void {
    this.getSampleById();
    this.getCategory();
  }
  getSampleById()
  {
    let id=this.route.snapshot.paramMap.get("id");
    this.rs.getSampleById(id).subscribe((res)=>{
      this.selected_sample=res.sample;
      this.selected_sample_pics=JSON.parse(this.selected_sample.samples);
      if(res)
      {
        this.getSamplesData=true;
      }
    })
  }
  getCategory() {
    this.ws.get_Samples_Category().subscribe((res) => {
      this.categories = res.categorys;
      console.log(res);
    })
  }
}
