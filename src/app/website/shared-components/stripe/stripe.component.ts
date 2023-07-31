import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { WebsiteService } from '../../website.service';

declare var elements: any;

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss']
})

export class StripeComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('cardInfo') cardInfo: ElementRef;

  stripeTest = this.fb.group({
    name: ['', [Validators.required]]
  });

  windows_detail;
  window_stripe;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  cardError = null;
  modalRef: BsModalRef;
  amount = null;
  id = null;
  service_type_id = null;
  type = null;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private websiteService: WebsiteService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async createToken() {
    const { token, error } = await this.window_stripe.createToken(this.card);

    if (error) {
      console.log(error);
    } else {
      const { paymentMethod, paymentMethodError } = await this.window_stripe.createPaymentMethod({
        type: 'card',
        card: this.card,
      });
      if (paymentMethodError) {
        console.log(paymentMethodError);
      } else {
        //   let payment = {
        //     amount:this.amount,
        //     id:this.id,
        //     service_type_id:this.service_type_id,
        //     type:this.type,
        //     paymentMethodId:paymentMethod.id
        //   }
        //   this.websiteService.createOrder(payment).subscribe((res)=>{
        //     console.log(res);
        //     this.bsModalRef.hide();
        //     this.toastr.success('Resume Uploaded Successfully', 'Success');
        //   },
        //   (error)=>{
        //     console.log(error);
        //     this.toastr.error('Resume Upload Failed', 'Error');
        //   })
        //   console.log('Something is wright:',paymentMethod)
      }
    }
  }

  ngAfterViewInit() {
    this.windows_detail = window;
    // this.windows_detail.TCO.loadPubKey('sandbox')
    this.window_stripe = this.windows_detail.stripe;
    const style = {
      base: {
        lineHeight: '24px',
        fontFamily: 'monospace',
        fontSmoothing: 'antialiased',
        fontSize: '19px',
        '::placeholder': {
        }
      }
    };
    this.card = elements.create('card', { style });
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }
}
