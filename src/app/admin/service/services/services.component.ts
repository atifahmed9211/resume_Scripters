import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit,OnDestroy {
  dtOptions : DataTables.Settings = {};
  dtTrigger : Subject<any>        = new Subject<any>();
  services  : any                 = [];
  dtInitial : boolean             = false
  constructor(
    private as:AdminService
  ) { }

  ngOnInit(): void {
    this.getServices();
  }

  getServices(){
    this.as.getAllServices().subscribe((res)=>{
      this.services = res.services;
      this.dtTrigger.next();
    },
    (error)=>{
      console.log(error);
    })
  }

  deleteService(id){
    this.as.deleteServiceById(id).subscribe((res)=>{
      console.log(res);
      this.getServices();
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
