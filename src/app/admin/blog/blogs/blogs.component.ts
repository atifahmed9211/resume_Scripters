import { Component, OnInit ,OnDestroy} from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AdminService } from '../../admin.service';
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnDestroy, OnInit {

  mediaUrl  : any                 = environment.mediaUrl;
  dtOptions : DataTables.Settings = {};
  dtTrigger : Subject<any>        = new Subject<any>();
  blogs     : any                 = [];

  constructor(
    private as : AdminService,
    private httpClient: HttpClient) { }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.getBlogs();
  }

  getBlogs(){
    this.as.getAllBlogs().subscribe((res)=>{
      console.log(res);
      this.blogs = res.blogs;
      this.dtTrigger.next();
    },
    (error)=>{
      console.log(error);
    })
  }

  deleteBlog(id){
    this.as.deleteBlogById(id).subscribe((res)=>{
      console.log(res);
      this.getBlogs();
    },
    (error)=>{
      console.log(error);
    })
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
