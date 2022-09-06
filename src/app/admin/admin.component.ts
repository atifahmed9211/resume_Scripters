import { Component, OnInit } from '@angular/core';
import { navItems } from './_nav';
import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [IconSetService],
})
export class AdminComponent implements OnInit {

  public sidebarMinimized = false;
  public navItems = navItems;

  constructor(
    public iconSet: IconSetService,
    public router : Router
  ) 
  {
    // iconSet singleton
    iconSet.icons = { ...freeSet };
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  logout(){
    localStorage.removeItem("adminToken");
    localStorage.removeItem("nickname");
    this.router.navigate(["admin/login"]);
  }

  ngOnInit(): void {
  }

}
