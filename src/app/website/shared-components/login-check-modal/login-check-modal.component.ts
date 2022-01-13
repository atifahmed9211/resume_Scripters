import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-login-check-modal',
  templateUrl: './login-check-modal.component.html',
  styleUrls: ['./login-check-modal.component.scss']
})
export class LoginCheckModalComponent implements OnInit {

  constructor(
    public bsModalRef : BsModalRef,
  ) { }

  ngOnInit(): void {
  }

}
