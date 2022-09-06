import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HomeComponent } from '../../home/home.component'; 
import { HomeServiceService } from '../../../services/home-service.service';
import {Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-login-check-modal',
  templateUrl: './login-check-modal.component.html',
  styleUrls: ['./login-check-modal.component.scss']
})
export class LoginCheckModalComponent implements OnInit {

  constructor(
    public bsModalRef : BsModalRef,
    private ModalService:BsModalService,
    private homeData:HomeServiceService,
    private router:Router,private route:ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }
  uploadCV()
  {
    console.log("CV Uploaded");
    this.homeData.showLoader=true;
    console.log(this.homeData.showLoader);
    this.bsModalRef.hide();
    this.pageRefresh();
  }
  pageRefresh()
  {
    this.router.routeReuseStrategy.shouldReuseRoute=()=>false;
    this.router.onSameUrlNavigation='reload';
    this.router.navigate(['./home'],{
      relativeTo:this.route
    })    
  }
}
