import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  @ViewChild('orderTabs', { static: false }) orderTabs: TabsetComponent;
  public order             = null;
  public questionnaireFIle = null;
  public mediaUrl          = environment.mediaUrl;
  constructor(
    private route : ActivatedRoute,
    private as    : UserService,
  ) { }

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder(){
    let id = this.route.snapshot.paramMap.get("id");
    this.as.getOrderById(id).subscribe((res)=>{
      console.log(res);
      this.order = res.order;
      if(this.order.answers_file == null || this.order.questions_file == null){
        this.orderTabs.tabs[1].disabled = true;
        this.orderTabs.tabs[2].disabled = true;
      }else{
        this.orderTabs.tabs[1].disabled = false;
        this.orderTabs.tabs[2].disabled = false;
      }
    },
    (error)=>{
      console.log(error);
    })
  }

  uploadFile(event){
    this.questionnaireFIle = event.target.files[0];
    let formData = new FormData();
    formData.append("id",this.order.id);
    formData.append("file",this.questionnaireFIle);
    this.as.uploadAnswersFile(formData).subscribe((res)=>{
      console.log(res);
      this.getOrder();
    },
    (error)=>{
      console.log(error);
    })
  }

}
