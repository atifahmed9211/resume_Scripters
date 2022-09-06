import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsiteRoutingModule } from './website-routing.module';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { ResumeServicesComponent } from './resume-services/resume-services.component';
import { CareerAdviceComponent } from './career-advice/career-advice.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqComponent } from './faq/faq.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { WriterDetailComponent } from './writer-detail/writer-detail.component';
import { OurWritersComponent } from './our-writers/our-writers.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FederalServicesComponent } from './federal-services/federal-services.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { StripeComponent } from './shared-components/stripe/stripe.component';
import { SignupComponent } from './signup/signup.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoginCheckModalComponent } from './shared-components/login-check-modal/login-check-modal.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { SignupModalComponent } from './signup-modal/signup-modal.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentConfirmationComponent } from './checkout/payment-confirmation/payment-confirmation.component';

@NgModule({
  declarations: [
    HomeComponent,
    BlogComponent,
    TestimonialsComponent,
    ResumeServicesComponent,
    CareerAdviceComponent,
    ContactUsComponent,
    FaqComponent,
    AboutUsComponent,
    BlogDetailComponent,
    WriterDetailComponent,
    OurWritersComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    FederalServicesComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    StripeComponent,
    SignupComponent,
    LoginCheckModalComponent,
    LoginModalComponent,
    SignupModalComponent,
    CheckoutComponent,
    PaymentConfirmationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    WebsiteRoutingModule,
    NgCircleProgressModule.forRoot({
      "renderOnClick":false,
      "percent":100,
      "radius": 60,
      "space": -5,
      "backgroundPadding":0,
      "outerStrokeGradient": false,
      "outerStrokeWidth": 5,
      "outerStrokeColor": "#00a67d",
      "outerStrokeGradientStopColor": "#53a9ff",
      "innerStrokeColor": "#e7e8ea",
      "innerStrokeWidth": 5,
      "title": "UI",
      "animateTitle": false,
      "animationDuration": 3000,
      "showTitle": false,
      "showSubtitle": false,
      "showUnits": false,
      "showBackground": true,
      "responsive": true,
      "lazy": true,
    }),
  ],
  entryComponents:[StripeComponent,LoginCheckModalComponent]
})
export class WebsiteModule { }
