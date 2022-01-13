import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog/blog.component';
import { BlogsComponent } from './blogs/blogs.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';

const routes: Routes = [
  {
    path:"",
    data: {
      title: 'Blogs'
    },
    children:[
      {
        path:'all',
        component:BlogsComponent,
        data: {
          title: 'All Blogs'
        }
      },
      {
        path:"blog/:id",
        component:BlogComponent,
        data: {
          title: 'Blog Detail'
        }
      },
      {
        path:'create',
        component:CreateBlogComponent,
        data: {
          title: 'Create Blog'
        }
      },
      {
        path:'edit/:id',
        component:CreateBlogComponent,
        data: {
          title: 'Update Blog'
        }
      },
      {
        path:'',
        redirectTo:"all"
      }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
