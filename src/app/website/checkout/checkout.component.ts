import { Component, OnInit,ViewChild,ElementRef,AfterViewInit, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
import { WebsiteService } from '../website.service';
import { FormControl,FormGroup,Validator, Validators } from '@angular/forms';
import { Token } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('cardInfo') cardInfo: ElementRef;
  
  selectedPackage;
  _totalAmount: number;
  card: any;
  userdata:any;
  cardHandler = this.onChange.bind(this);
  cardError: string=" ";
  id = null;
  service_type_id = null;
  type = null;
  loginUserName=JSON.parse(localStorage.getItem('user'))

  constructor(
    private cd: ChangeDetectorRef,
    private webservice: WebsiteService,
    private modalService: BsModalService,
    private http:HttpClient,
  ) { 
    this.selectedPackage=webservice.selectedPackage;
    console.log("selected package",this.selectedPackage)
    this._totalAmount = this.selectedPackage.price;
  }
  public bsModalRef: BsModalRef;
  checkoutForm:FormGroup=new FormGroup({
    name:new FormControl(this.loginUserName['name'],[Validators.required]),
    email:new FormControl(this.loginUserName['email'],[Validators.required,Validators.email]),
    phone_number:new FormControl("",[Validators.required]),
  });
  ngOnDestroy() {
    if (this.card) {
      // We remove event listener here to keep memory clean
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }
  }
  ngAfterViewInit() {
    this.initiateCardElement();
  }
  initiateCardElement() {
    // Giving a base style here, but most of the style is in scss file
    const cardStyle = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };
    this.card = elements.create('card', { cardStyle });
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }
  onChange({ error }) {
    if (error) {
      this.cardError = error.message;
    } else {
      this.cardError = null;
    }
    this.cd.detectChanges();
  }
  userData={
     name:this.checkoutForm.value.name,
  }
  async createStripeToken() {
    console.log("create token method called");
    console.log(this.userData);
    const { token, error } = await stripe.createToken(this.card,this.userData);
    if (token) {
      this.onSuccess(token);
    } else {
      this.onError(error);
    }
  }
  onSuccess(token) {
    let payload = {
      stoken: token.id,
      amount: this._totalAmount,
      currency: 'USD'
    }
    console.log("token generated successfully");
    this.http.post('/stripe', payload).subscribe((res:any)=>{
      console.log(res);
      let payment;
      let pkgid=this.webservice.selectedPackage;
      let service_type=pkgid.service_types;
      this.type='card';
      if(res.status==200)
      {
        payment = {
          amount:this._totalAmount,
          id:pkgid,
          service_type_id:service_type[0].id,
          type:"packages",
          paymentMethodId:res.trn
          }
        this.webservice.createOrder(payment).subscribe((res)=>{
          console.log("res",res);
          this.webservice.newOrderId=res.order.id;
        },
        (error)=>{
          console.log("error",error);
        });
        this.bsModalRef = this.modalService.show(PaymentConfirmationComponent, {class: 'modal-dialog-centered'});
        this.bsModalRef.content.closeBtnName = 'Close';
      }
    });
  }
  onError(error) {
    if (error.message) {
      this.cardError = error.message;
      console.log("token not generated");
    }
  }

  ngOnInit(): void {
    
  }

  get name()
  {
    return this.checkoutForm.get('name');
  }
  get email()
  {
    return this.checkoutForm.get('email');
  }
  get phone_number()
  {
    return this.checkoutForm.get('phone_number');
  }
  }
