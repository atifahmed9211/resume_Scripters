import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { WebsiteService } from '../website.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})

export class BlogDetailComponent implements OnInit {

  blog        = null;
  mediaUrl    = environment.mediaUrl;
  blogs = [];
  blog_title;

  constructor(
    private websiteService : WebsiteService,
    private router         : ActivatedRoute,
    private route:Router
  ) { }

  ngOnInit(): void {
    this.blog=JSON.parse(localStorage.getItem("selected_blog"));
      this.getBlogs();
  }

  getBlogs() {
    this.websiteService.getAllBlogs().subscribe((res) => {
      this.blogs = res.blogs;
    },
      (error) => {
        console.log(error);
      })
  }
  
  getTrimText(text,length) {
    var words = text.split(" ")
    var trimmedText = "";
    if (words.length > length) {
      for (let i = 0; i < length; i++) {
        trimmedText += words[i] + " ";
      }
      trimmedText += ".....";
    }
    else 
    {
      trimmedText=text;
    }
    return trimmedText;
  }

  getSpecificBlog(id) {
    this.websiteService.getBlogById(id).subscribe((res) => {
      localStorage.setItem("selected_blog", JSON.stringify(res.blog));
      if (res) {
        this.route.navigate(["/blog-detail/" + id])
        this.pageRefresh();
      }
    },
      (error) => {
        console.log(error);
      })
  }

  pageRefresh() {
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate(['./'], {
      relativeTo: this.router
    })
  }
}
