import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../user.service';
@Component({
  selector: 'app-critique',
  templateUrl: './critique.component.html',
  styleUrls: ['./critique.component.scss']
})
export class CritiqueComponent implements OnInit {

  public critique     = null;
  public mediaUrl     = environment.mediaUrl;

  constructor(
    private route : ActivatedRoute,
    private us    : UserService,
  ) { }

  ngOnInit(): void {
    this.getCritique();
  }
 
  getCritique(){
    let id = this.route.snapshot.paramMap.get("id");
    this.us.getCritiqueById(id).subscribe((res)=>{
      console.log(res);
      this.critique = res.critique;
    },
    (error)=>{
      console.log(error)
    });
  }

}
