import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl,FormGroup} from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../user/user.service';
import { WebsiteService } from '../../website.service';


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
  ) { 
  }

  ngOnInit(): void {
  }
  questionForm:FormGroup=new FormGroup({
    q1:new FormControl(''),
    q2:new FormControl(''),
    q3:new FormControl(''),
    q4:new FormControl(''),
    q5:new FormControl(''),
    q6:new FormControl(''),
    q7:new FormControl(''),
    q8:new FormControl(''),
  })
  formData = new FormData();
  submitCV(event)
  {
    this.formData.append("file",event.target.files[0]);
  }
  submitQuestion()
  {
    this.orderId=this.webservice.newOrderId;
    console.log("order",this.orderId);
    console.log(JSON.stringify(this.questionForm.value))
    this.formData.append("id",this.orderId);
    this.formData.append("answers",JSON.stringify(this.questionForm.value));
    this.as.uploadAnswersFile(this.formData).subscribe((res)=>{
      console.log(res);
      this.bsModalRef.hide();
    },
    (error)=>{
      console.log(error);
    })
  }
}
