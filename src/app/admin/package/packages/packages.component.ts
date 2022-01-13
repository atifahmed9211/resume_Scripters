import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit,OnDestroy {
  dtOptions : DataTables.Settings = {};
  dtTrigger : Subject<any>        = new Subject<any>();
  packages  : any                 = [];
  dtInitial : boolean             = false
  constructor(
    private as:AdminService
  ) { }

  ngOnInit(): void {
    this.getPackages();
  }

  getPackages(){
    this.as.getAllPackages().subscribe((res)=>{
      this.packages = res.packages;
      this.dtTrigger.next();
    },
    (error)=>{
      console.log(error);
    })
  }

  deletePackage(id){
    this.as.deletePackageById(id).subscribe((res)=>{
      console.log(res);
      this.getPackages();
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
