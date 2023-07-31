import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { WebsiteService } from '../../../website/website.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  public user = null;
  packages = [];
  all_blogs = [];
  recent_blogs = [];
  showOrderList = false;  //show order info into html page
  showCritique = false;
  showPackageList: boolean = false;
  showBlogs = false;
  all_orders = [];
  pending_orders: number = 0;
  completed_orders: number = 0;
  orders: any = [];
  package_title = [];
  user_order_status = environment.user_status;
  order_percentage = environment.order_percentage;
  critiques: any = [];
  userName;
  email;
  mediaURL = environment.mediaUrl;
  firstTwoLetter;
  fullNameArray;

  constructor(
    private us: UserService,
    private webService: WebsiteService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem("user")) {
      this.user = JSON.parse(localStorage.getItem("user"))
      this.fullNameArray = this.user.name.split(' ');
      if (this.fullNameArray.length >= 2) {
        this.firstTwoLetter = this.fullNameArray[0].slice(0, 1).toUpperCase() + this.fullNameArray[1].slice(0, 1).toUpperCase();
      }
      else {
        this.firstTwoLetter = this.fullNameArray[0].slice(0, 1).toUpperCase();
      }
    }
    this.getPackages();
    this.getBlogs();
    this.getOrders();
    this.getCritiques();
  }

  getPackages() {
    this.webService.getAllPackages("Private Sector").subscribe((res) => {
      if (res) {
        this.showPackageList = true;
        this.packages = res.packages;
      }
    },
      (error) => {
        console.log(error);
      })
  }

  BuyNow(pkgId) {
    if (this.user) {
      this.router.navigate(['./checkout'])
      for (let pkg of this.packages) {
        if (pkg.id == pkgId) {
          //in case user reload page then to save data as a backup
          localStorage.setItem("selectedPackage", JSON.stringify(pkg))
        }
      }
    }
    else {
      this.router.navigate(['./login'])
    }
  }

  getBlogs() {
    this.webService.getAllBlogs().subscribe((res) => {
      if (res) {
        this.showBlogs = true;
        this.all_blogs = res.blogs;
        if (this.all_blogs.length != 0) {
          //extracting last two blogs
          this.recent_blogs.push(this.all_blogs[this.all_blogs.length - 1])
          this.recent_blogs.push(this.all_blogs[this.all_blogs.length - 2])
        }
      }
    },
      (error) => {
        console.log(error);
      })
  }

  getOrders() {
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let usertoken = localStorage.getItem("userToken");
    //in case we delete token from browser(Application)
    if (usertoken != null) {
      this.us.getOrdersByUser().subscribe((res) => {
        if (res) {
          this.showOrderList = true;
          this.userName = res.order[0].name;
          this.all_orders = res.order[0].orders;   //list of all orders
          if (this.all_orders.length != 0) {
            //extracting last two order
            this.orders.push(this.all_orders[this.all_orders.length - 1]);
            this.orders.push(this.all_orders[this.all_orders.length - 2]);
            //extracting pending orders and completed orders
            for (let item of this.all_orders) {
              if (item.status != 6) {
                this.pending_orders++;
              }
              else {
                this.completed_orders++;
              }
            }
            //for packages
            for (let temp of this.orders) {
              let a = temp.packages;
              if (a.length > 0) {
                let b = a[0];
                this.package_title.push(b.title);
              }
              else {
                this.package_title.push(null);
              }
            }
          }
        }
      },
        (error) => {
          //in case we edit token from browser(Application)
          console.log(error);
          if (error.status == 401) {
            localStorage.removeItem("userToken");
            localStorage.removeItem("user");
            localStorage.removeItem("nick name");
            this.router.navigateByUrl('login');
          }
        })
    }
    else {
      this.router.navigateByUrl('login');
    }
  }
  
  getCritiques() {
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let usertoken = localStorage.getItem("userToken");
    //in case we delete token from browser(Application)
    if (usertoken != null) {
      this.us.getCritiquesByUser().subscribe((res) => {
        this.critiques = res.critiques[0].critiques;
        this.showCritique = true;
      },
        (error) => {
          console.log(error);
        })
    }
    else {
      this.router.navigateByUrl('login');
    }
  }
}
