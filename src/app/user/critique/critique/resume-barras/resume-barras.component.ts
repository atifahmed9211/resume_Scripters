import { Component, OnInit, Input} from '@angular/core';
import {ResumeModel} from "../model/resume.model";

@Component({
  selector: 'app-resume-barras',
  templateUrl: './resume-barras.component.html',
  styleUrls: ['./resume-barras.component.scss']
})

export class ResumeBarrasComponent implements OnInit {

  @Input() List: Array<ResumeModel>;
  
  public Total=0;
  public MaxHeight= 160;

  constructor() { }

  ngOnInit(): void {
    this.MontarGrafico();
  }

  MontarGrafico(){
    this.List.forEach(element => {
      this.Total += element.Value;
    });

    this.List.forEach(element => {
      element.Size = Math.round((element.Value*this.MaxHeight)/this.Total) + '%';
    });
  }
}
