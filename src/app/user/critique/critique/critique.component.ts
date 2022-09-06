import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../user.service';
import { ResumeModel } from "../critique/model/resume.model";
import * as AOS from 'aos';

@Component({
  selector: 'app-critique',
  templateUrl: './critique.component.html',
  styleUrls: ['./critique.component.scss']
})
export class CritiqueComponent implements OnInit {

  public critique     = null;
  public Brevity_Impact_Depth: Array<ResumeModel>
  public brevity=null;
  public impact=null;
  public depth=null;
  public users=null;
  public mediaUrl     = environment.mediaUrl;
  public circle_color:any=["rgb(26, 204, 184)","rgb(16, 105, 224)","rgb(7, 200, 248)"];

  constructor(
    private route : ActivatedRoute,
    private us    : UserService,
      ) {
       }

  ngOnInit(): void {
    AOS.init();  
    this.getCritique();
  }
 
  getCritique(){
    let id = this.route.snapshot.paramMap.get("id");
    this.us.getCritiqueById(id).subscribe((res)=>{
      console.log(res);
      this.critique = res.critique;
      this.brevity=this.critique.brevity;
      this.impact=this.critique.impact;
      this.depth=this.critique.depth;
      this.users=this.critique.users;
      this.initializeBrevity()
    },
    (error)=>{
      console.log(error)
    });
  }
  initializeBrevity()
  {
  this.Brevity_Impact_Depth = [
    {Value:parseInt(this.brevity), Color:'#f2ac03', Size:'', Legend:'Brevity'},
    {Value:parseInt(this.impact), Color: '#106eed', Size:'', Legend:'Impact'},
    {Value:parseInt(this.depth), Color: '#0fe1c9', Size:'', Legend:'Depth'},
  ];
  }
  public static a=-1;
  public circle_background_color;
  getCircleColor(index)
  {
    if(index==0)
    {
      CritiqueComponent.a=-1
    }
      CritiqueComponent.a++;
      if(CritiqueComponent.a==3)
      {
        CritiqueComponent.a=0;
      }
      this.circle_background_color=this.circle_color[CritiqueComponent.a]; 
      return this.circle_background_color;
    }
    getPercentage()
    {
      console.log("WordCount",this.critique.word_count);
      let per=(this.critique.word_count/1730)*100;
      console.log("Percentage",per);
      if(per>=98)
      {
      per=98;  
      }
      return per+"%";
    }
    getTransformRotation()
    {
      let rot
      let file_size=this.critique.file_size;
      if(file_size<600)
      {
      console.log("File Size",file_size);
      rot=(file_size/600)*200;
      console.log("Rotation",rot);
      }
      else{
        rot=180;  
      }
      return rot+"deg";
    }
  }