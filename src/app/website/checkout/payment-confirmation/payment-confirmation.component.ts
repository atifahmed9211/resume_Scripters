import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../user/user.service';
import { WebsiteService } from '../../website.service';
import{Router} from '@angular/router'

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.scss']
})

export class PaymentConfirmationComponent implements OnInit {

  public orderId;
  public questionnaireFIle = null;
  public mediaUrl          = environment.mediaUrl;

  constructor(
    public bsModalRef: BsModalRef,
    private route : ActivatedRoute,
    private as    : UserService,
    private webservice: WebsiteService,
    private router:Router
  ) { 
  }

  ngOnInit(): void {
  }
  
  redirectToOrder()
  {
    this.bsModalRef.hide()
    this.router.navigate(['./user/orders/order/'+this.webservice.newOrderId]);
  }
}
