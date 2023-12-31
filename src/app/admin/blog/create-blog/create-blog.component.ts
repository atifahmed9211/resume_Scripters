import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss']
})

export class CreateBlogComponent implements OnInit {

  public Editor = ClassicEditor;
  public editor = null;
  public blogTitle = null;
  public blogFile = null;
  public blogId = null;
  public btnText = 'Submit';
  public config = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "indent",
        "outdent",
        "|",
        // "imageUpload",
        "blockQuote",
        "insertTable",
        // "mediaEmbed",
        "undo",
        "redo"
      ]
    },
    // image:{
    //   toolbar:[
    //     "imageStyle:full",
    //     "imageStyle:side",
    //     "|",
    //     "imageTextAlternative"
    //   ]
    // },
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells"
      ]
    },
    language: "en"
  }

  constructor(
    private as: AdminService,
    private router: ActivatedRoute,
    private route: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    let id = this.router.snapshot.paramMap.get("id");
    if (id) {
      this.getBlog(id);
    }
  }

  onReady(editor) {
    this.editor = editor;
  }

  blogImage(event) {
    this.blogFile = event.target.files[0];
  }

  saveBlog() {
    let formData = new FormData();
    formData.append("title", this.blogTitle);
    formData.append("file", this.blogFile);
    formData.append("description", this.editor.getData());
    if (this.blogId) {
      formData.append("id", this.blogId);
      /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
      let admintoken = localStorage.getItem("adminToken");
      //in case we delete token from browser(Application)
      if (admintoken != null) {
        this.as.updateBlog(formData).subscribe((res) => {
          this.route.navigateByUrl("/admin/blog/all");
        },
          (error) => {
            console.log(error);
          })
      }
      else {
        this.route.navigateByUrl('admin/login');
      }
    } else {
      /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
      let admintoken = localStorage.getItem("adminToken");
      //in case we delete token from browser(Application)
      if (admintoken != null) {
        this.as.createBlog(formData).subscribe((res) => {
          this.toastr.success('Blog Created Successfully', 'Success');
          this.route.navigateByUrl("/admin/blog/all");
        },
          (error) => {
            console.log(error);
            this.toastr.error('Blog Creation Failed', 'Error');
          })
      }
      else {
        this.route.navigateByUrl('admin/login');
      }
    }
  }

  getBlog(id) {
    this.as.getBlogById(id).subscribe((res) => {
      this.blogId = res.blog.id;
      this.blogTitle = res.blog.title;
      this.editor.setData(res.blog.description);
      this.btnText = "Update";
    },
      (error) => {
        console.log(error);
      })
  }
}

