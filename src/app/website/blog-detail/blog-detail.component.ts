import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { WebsiteService } from '../website.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {

  navbarClass = "navbar2";
  blog        = null;
  mediaUrl    = environment.mediaUrl;

  constructor(
    private websiteService : WebsiteService,
    private router         : ActivatedRoute
  ) { }

  getBlog(id){
    this.websiteService.getBlogById(id).subscribe((res)=>{
      this.blog = res.blog;
    },
    (error)=>{
      console.log(error);
    })
  }

  ngOnInit(): void {
    let id = this.router.snapshot.paramMap.get("id");
    if(id){
      this.getBlog(id);
    }
  }

}
