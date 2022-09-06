import { Component, OnInit } from '@angular/core';
import { navItems } from './_nav';
import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [IconSetService],
})
export class UserComponent implements OnInit {

  username: any;
  public user = null;

  public sidebarMinimized = false;
  public navItems = navItems;

  constructor(
    public iconSet: IconSetService,
    public router: Router
  ) {
    // iconSet singleton
    iconSet.icons = { ...freeSet };
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  public logout(): void {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    this.router.navigateByUrl('');
  }

  ngOnInit(): void {
    if (localStorage.getItem("user")) {
      this.user = JSON.parse(localStorage.getItem("user"))
      console.log(this.user);
      // to display username in html page
      this.username = this.user.name;
    }
  }
}
