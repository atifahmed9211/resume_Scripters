import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { ResumeServicesComponent } from './resume-services/resume-services.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqComponent } from './faq/faq.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { WriterDetailComponent } from './writer-detail/writer-detail.component';
import { OurWritersComponent } from './our-writers/our-writers.component';
import { LoginComponent } from './login/login.component';
import { FederalServicesComponent } from './federal-services/federal-services.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { SignupComponent } from './signup/signup.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ResumeSamplesComponent } from './resume-samples/resume-samples.component';
import { ReferralsComponent } from './referrals/referrals.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data:{data:"home"}
  },

  {
    path: 'Resume-service',
    component: ResumeServicesComponent,
    data:{data:"Resume-service"}
  },
  {
    path: 'federal',
    component: FederalServicesComponent,
    data:{data:"federal"}
  },

  {
    path: "testimonials",
    component: TestimonialsComponent,
    data:{data:"testimonials"}
  },

  {
    path: "contact-us",
    component: ContactUsComponent,
    data:{data:"contact-us"}
  },

  {
    path: "FAQ's",
    component: FaqComponent,
    data:{data:"FAQ's"}
  },

  {
    path: "blog",
    component: BlogComponent,
    data:{data:"blog"}
  },

  {
    path: "blog-detail/:id",
    component: BlogDetailComponent,
    data:{data:"blog-detail"}
  },
  {
    path: "resume_samples",
    component:ResumeSamplesComponent,
  },
  
  {
    path: "about-us",
    component: AboutUsComponent,
    data:{data:"about-us"}
  },

  {
    path: "writers",
    component: OurWritersComponent,
    data:{data:"writers"}
  },

  {
    path: "writer-detail",
    component: WriterDetailComponent,
    data:{data:"writer-detail"}
  },

  {
    path: "login",
    component: LoginComponent,
    data:{data:"login"}
  },

  {
    path: "register",
    component: SignupComponent,
    data:{data:"register"}
  },

  {
    path: "privacy-policy",
    component: PrivacyPolicyComponent,
    data:{data:"privacy-policy"}
  },

  {
    path: "terms-and-conditions",
    component: TermsConditionsComponent,
    data:{data:"terms-and-conditions"}
  },

  {
    path: '',
    redirectTo:"home",
    pathMatch:"full"
  },
  {
    path:'checkout',
    component:CheckoutComponent
  },
  {
    path: "referrals",
    component:ReferralsComponent,
    data:{data:""}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
