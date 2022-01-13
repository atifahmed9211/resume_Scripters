import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminService } from '../../admin.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-critiques',
  templateUrl: './critiques.component.html',
  styleUrls: ['./critiques.component.scss']
})
export class CritiquesComponent implements OnDestroy,OnInit {
  mediaUrl                        = environment.mediaUrl;
  dtOptions : DataTables.Settings = {};
  dtTrigger : Subject<any>        = new Subject<any>();
  critiques : any                 = [];
  dtInitial : boolean             = false;

  constructor(
    private as:AdminService
  ) { }

  ngOnInit(): void {
    this.getCritiques();
  }

  getCritiques(){
    this.as.getAllCritiques().subscribe((res)=>{
      this.critiques = res.critiques;
      console.log(this.critiques);
      this.dtTrigger.next();
    },
    (error)=>{
      console.log(error);
    })
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
