import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WebsiteService } from '../website.service';

@Component({
  selector: 'app-federal-services',
  templateUrl: './federal-services.component.html',
  styleUrls: ['./federal-services.component.scss']
})

export class FederalServicesComponent implements OnInit {

  services = [];
  packages = [];
  bsModalRef: BsModalRef;
  amount = null;
  public user = null;

  constructor(
    private webService: WebsiteService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getServices();
    if (localStorage.getItem("user")) {
      this.user = JSON.parse(localStorage.getItem("user"))
    }
  }

  buyService(id) {
    if (this.user) {
      this.router.navigate(['./checkout'])
      for (let service of this.services) {
        if (service.id == id) {
          //in case user reload page then to save data as a backup
          localStorage.setItem("selectedPackage", JSON.stringify(service))
        }
      }
    }
    else {
      this.router.navigate(['./login'])
    }
  }

  getServices() {
    this.webService.getAllServices("Federal").subscribe((res) => {
      this.services = res.service[0].services;
    },
      (error) => {
        console.log(error);
      })
  }

  getPackages() {
    this.webService.getAllPackages("Federal").subscribe((res) => {
      this.packages = res.packages;
    },
      (error) => {
        console.log(error);
      })
  }
}
