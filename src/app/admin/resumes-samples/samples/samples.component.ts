import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { WebsiteService } from '../../../website/website.service';
import { ResumeSampleService } from '../resume-sample.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss']
})

export class SamplesComponent implements OnInit, OnDestroy {

  samples: [];
  categories =[];
  getSamplesData = false; //to show loader
  //to save value when we click on edit button
  selected_sample_id;
  selected_sample_name;
  selected_sample_category;
  makeBlur = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  update_sample_form = new FormGroup({
    sample_name: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required)
  });

  constructor(
    public ws: WebsiteService,
    public rs: ResumeSampleService,
    public toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5
    };
    this.getSample();
    this.getCategory();
  }

  getSample() {
    setTimeout(() => {
      this.dtTrigger.next();
    }, 1000)
    this.ws.getSamples().subscribe((res) => {
      if (res) {
        this.getSamplesData = true;
        this.samples = res.samples;
      }
    })
  }
  getCategory() {
    this.ws.get_Samples_Category().subscribe((res) => {
      if(res)
      {
      this.categories = res.categorys;
      }
    })
  }
  deleteSample(id) {
    this.getSamplesData = false;
    this.rs.deleteSample(id).subscribe((res) => {
      if (res) {
        this.getSamplesData = true;
        this.toast.success("Sample Deleted");
        this.getSample();
      }
    })
  }
  getSelectedSample(id, name, category) {
    this.selected_sample_id = id;
    this.selected_sample_name = name;
    this.selected_sample_category = category;
    this.makeBlur = true;
  }
  closeModal() {
    this.makeBlur = false;
  }
  updateSample() {
    this.closeModal();
    this.getSamplesData = false;
    let formData = new FormData;
    console.log(this.update_sample_form);
    formData.append("id", this.selected_sample_id);
    formData.append("name", this.update_sample_form.value["sample_name"]);
    formData.append("category", this.update_sample_form.value["category"]);
    this.rs.updateSample(formData).subscribe((res) => {
      if (res) {
        this.getSamplesData = true;
        this.toast.success("Sample Updated");
        this.getCategory();
        this.getSample();
      }
    })
  }
  getCategoryName(id) {
    for (let item of this.categories) {
      if(item.id==id)
      {
        return item.name;
      }
    }
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
