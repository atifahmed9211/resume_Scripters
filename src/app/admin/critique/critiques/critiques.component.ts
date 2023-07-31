import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminService } from '../../admin.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-critiques',
  templateUrl: './critiques.component.html',
  styleUrls: ['./critiques.component.scss']
})

export class CritiquesComponent implements OnDestroy, OnInit {

  mediaUrl = environment.mediaUrl;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  critiques: any = [];
  dtInitial: boolean = false;
  showCritiqueList = false;  //show critique info into html page
  users_email: any = [];
  users_name:any=[];

  constructor(
    private as: AdminService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCritiques();
  }

  getCritiques() {
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.getAllCritiques().subscribe((res) => {
        if (res) {
          this.showCritiqueList = true;
          this.critiques = res.critiques.slice().reverse();
          //get user email and name
          for (let item of this.critiques) {
            let temp = item.users[0];
            if (temp) {
              this.users_email.push(temp.email);
              this.users_name.push(temp.name);
            }
            else {
              this.users_email.push(null);
              this.users_name.push(null);
            }
          }
          this.dtTrigger.next();
        }
      },
        (error) => {
          console.log(error);
        })
    }
    else {
      this.router.navigateByUrl('admin/login');
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
