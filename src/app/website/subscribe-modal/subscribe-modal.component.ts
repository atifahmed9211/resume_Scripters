import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-subscribe-modal',
  templateUrl: './subscribe-modal.component.html',
  styleUrls: ['./subscribe-modal.component.scss']
})

export class SubscribeModalComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
  }

  close()
  {
    this.bsModalRef.hide()
  }
}
