import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { WebsiteService } from '../website.service';
import { LoginCheckModalComponent } from '../shared-components/login-check-modal/login-check-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FileUploadConfirmationComponent } from '../home/file-upload-confirmation/file-upload-confirmation.component';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})

export class BlogComponent implements OnInit {

  @ViewChild('file_upload') fileMessage: ElementRef;

  blogs = [];
  mediaUrl = environment.mediaUrl;
  showModal = false;
  showLoader = true;
  bsModalRef: BsModalRef;

  constructor(
    private webService: WebsiteService,
    private modalService: BsModalService,
    private route: Router
  ) { }

  ngOnInit() {
    let blogs = localStorage.getItem("all_blogs");
    if (!blogs) {
      this.getAllBlogs();
    }
    else {
      this.blogs = JSON.parse(blogs);
      this.showLoader = false;
    }
  }

  getAllBlogs() {
    this.webService.getAllBlogs().subscribe((res) => {
      this.blogs = res.blogs;
      //to avoid API call again and again
      localStorage.setItem("all_blogs", JSON.stringify(res.blogs));
      if (res) {
        this.showLoader = false;
      }
    },
      (error) => {
        console.log(error);
      })
  }

  uploadResume(event) {
    this.webService.uploadedCVFile = event.target.files[0];
    //show get critique modal
    this.bsModalRef = this.modalService.show(LoginCheckModalComponent, { class: 'modal-dialog-centered' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.showModal = true;
    this.bsModalRef.onHidden.subscribe(() => {
      this.showModal = false;
      if (this.webService.critiqueTaskCompleted) {
        this.webService.critiqueTaskCompleted = false;
        this.bsModalRef = this.modalService.show(FileUploadConfirmationComponent, { class: 'modal-dialog-centered' });
        this.bsModalRef.content.closeBtnName = 'Close';
      }
    }),
    this.fileMessage.nativeElement.value = null //to select same file twice
  }

  getTrimText(text, length) {
    var words = text.split(" ")
    var trimmedText = "";
    if (words.length > length) {
      for (let i = 0; i < length; i++) {
        trimmedText += words[i] + " ";
      }
      trimmedText += ".....";
    }
    else {
      trimmedText = text;
    }
    return trimmedText;
  }

  getSpecificBlog(id) {
    this.webService.getBlogById(id).subscribe((res) => {
      localStorage.setItem("selected_blog", JSON.stringify(res.blog));
      if (res) {
        this.route.navigate(["/blog-detail/" + id])
      }
    },
      (error) => {
        console.log(error);
      })
  }
}
