import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { WebsiteService } from '../website.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  navbarClass = "navbar2";
  blogs       = [];
  mediaUrl    = environment.mediaUrl;
  constructor(
    private webService : WebsiteService,
  ) { }

  getAllBlogs(){
    this.webService.getAllBlogs().subscribe((res)=>{
      console.log(res);
      this.blogs = res.blogs;
    },
    (error)=>{
      console.log(error);
    })
  }

  ngOnInit() {
    this.getAllBlogs();
  }

}
