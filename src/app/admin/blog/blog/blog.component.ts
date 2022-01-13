import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BlogComponent implements OnInit {

  public blog     = null;
  public mediaUrl = environment.mediaUrl;

  constructor(
    private as     : AdminService,
    private router : ActivatedRoute
  ) { }

  getBlog(id){
    this.as.getBlogById(id).subscribe((res)=>{
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
