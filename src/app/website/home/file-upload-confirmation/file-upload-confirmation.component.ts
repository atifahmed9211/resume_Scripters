import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-file-upload-confirmation',
  templateUrl: './file-upload-confirmation.component.html',
  styleUrls: ['./file-upload-confirmation.component.scss']
})

export class FileUploadConfirmationComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef) { 
  }

  ngOnInit(): void {
  }

  close()
  {
    this.bsModalRef.hide();
  }
}
