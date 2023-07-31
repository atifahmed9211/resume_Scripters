import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})

export class ServicesComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  services: any = [];
  dtInitial: boolean = false
  showServicesList = false;

  constructor(
    private as: AdminService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getServices();
  }

  getServices() {
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.getAllServices().subscribe((res) => {
        if (res) {
          this.showServicesList = true;
          this.services = res.services;
          this.dtTrigger.next();
        }
      },
        (error) => {
          console.log(error);
        })
    } else {
      this.router.navigateByUrl('admin/login');
    }
  }

  deleteService(id) {
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.deleteServiceById(id).subscribe((res) => {
        this.getServices();
      },
        (error) => {
          console.log(error);
        })
    } else {
      this.router.navigateByUrl('admin/login');
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
