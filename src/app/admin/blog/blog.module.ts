import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogComponent } from './blog/blog.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { DataTablesModule } from "angular-datatables";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { WebsiteModule } from '../../website/website.module';

@NgModule({
  declarations: [BlogsComponent, BlogComponent, CreateBlogComponent],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    CKEditorModule,
    BlogRoutingModule,
    WebsiteModule
  ]
})
export class BlogModule { }
