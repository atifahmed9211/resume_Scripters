import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
import { WebsiteService } from '../website.service';
import { FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Token } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { UserService } from '../../user/user.service';
import{Router} from '@angular/router'

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, OnDestroy, AfterViewInit {
  
  @ViewChild('cardInfo') cardInfo: ElementRef;

  loginUserName = JSON.parse(localStorage.getItem('user'))
  checkoutForm: FormGroup = new FormGroup({
    name: new FormControl(this.loginUserName['name'], [Validators.required]),
    email: new FormControl(this.loginUserName['email'], [Validators.required, Validators.email]),
    phone_number: new FormControl("", [Validators.required]),
    discountCode:new FormControl("")
  });

  showLoading = false;
  selectedPackage;
  _totalAmount: number;
  card: any;
  userdata: any;
  cardHandler = this.onChange.bind(this);
  cardError: string = " ";
  id = null;
  service_type_id = null;
  type = null;
  public bsModalRef: BsModalRef;
  userData = {
    name: this.checkoutForm.value.name,
  }
  showBtn=false;

  constructor(
    private cd: ChangeDetectorRef,
    private webservice: WebsiteService,
    private modalService: BsModalService,
    private http: HttpClient,
    private us: UserService,
    private router:Router
  ) {
    this.selectedPackage = JSON.parse(localStorage.getItem("selectedPackage"))
    this._totalAmount = this.selectedPackage.price;
  }

  ngOnInit(): void {

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

  async createStripeToken() {
    this.showLoading = true;
    const { token, error } = await stripe.createToken(this.card, this.userData);
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
    this.us.stripe(payload).subscribe((res) => {
      let payment;
      let pkgid = JSON.parse(localStorage.getItem("selectedPackage"));
      //to check whether user has selected a package or service
      let service_type
      if (pkgid.service_types) {
        //in case user select a package
        service_type = pkgid.service_types;
      }
      this.type = 'card';
      if (res.status == 200) {
        if (service_type) {
          payment = {
            amount: this._totalAmount,
            id: pkgid,
            service_type_id: service_type[0].id,
            type: "packages",
            paymentMethodId: res.trn
          }
        }
        else {
          payment = {
            amount: this._totalAmount,
            id: pkgid,
            service_type_id: this.selectedPackage.pivot.service_type_id,
            type: "service",
            paymentMethodId: res.trn
          }
        }
        this.webservice.createOrder(payment).subscribe((res) => {
          console.log("test",res);
          this.webservice.newOrderId = res.order.id;
        },
          (error) => {
            console.log("error", error);
          });
        this.bsModalRef = this.modalService.show(PaymentConfirmationComponent, { class: 'modal-dialog-centered' });
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.onHidden.subscribe(() => {
          this.showLoading = false;
          this.router.navigate(['./user/orders/order/' + this.webservice.newOrderId]);
        });
      }
    });
  }

  onError(error) {
    if (error.message) {
      this.cardError = error.message;
      console.log(this.cardError);
    }
  }

  get name() {
    return this.checkoutForm.get('name');
  }

  get email() {
    return this.checkoutForm.get('email');
  }

  get phone_number() {
    return this.checkoutForm.get('phone_number');
  }
  get discount_code()
  {
    return this.checkoutForm.get('discountCode');
  }

  getTrimText(text) {
    var words = text.split(" ")
    var trimmedText = "";
    if (words.length > 30) {
      for (let i = 0; i < 30; i++) {
        trimmedText += words[i] + " ";
      }
      trimmedText += ".....";
    }
    else {
      trimmedText = text;
    }
    return trimmedText;
  }

  ngAfterViewInit() {
    this.initiateCardElement();
  }

  ngOnDestroy() {
    if (this.card) {
      // We remove event listener here to keep memory clean
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }
  }
  showEnterBtn()
  {
    if(this.discount_code.value)
    {
      this.showBtn=true;
    }
    else{
      this.showBtn=false;
    }
  }
}
