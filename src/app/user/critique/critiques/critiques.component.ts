import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../user.service';
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

  constructor(
    private us: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCritiques();
  }

  getCritiques() {
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let usertoken = localStorage.getItem("userToken");
    //in case we delete token from browser(Application)
    if (usertoken != null) {
      this.us.getCritiquesByUser().subscribe((res) => {
        if (res) {
          this.showCritiqueList = true;
          this.critiques = res.critiques;
          this.dtTrigger.next();
        }
      },
        (error) => {
          console.log(error);
        })
    }
    else {
      this.router.navigateByUrl('login');
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
