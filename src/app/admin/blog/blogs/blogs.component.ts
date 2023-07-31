import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})

export class BlogsComponent implements OnDestroy, OnInit {

  mediaUrl: any = environment.mediaUrl;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  blogs: any = [];
  showBlogsList = false;

  constructor(
    private as: AdminService,
    private router: Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.getBlogs();
  }

  getBlogs() {
    this.as.getAllBlogs().subscribe((res) => {
      if (res) {
        this.showBlogsList = true;
        this.blogs = res.blogs;
        this.dtTrigger.next();
      }
    },
      (error) => {
        console.log(error);
      })
  }

  deleteBlog(id) {
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.deleteBlogById(id).subscribe((res) => {
        this.getBlogs();
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
