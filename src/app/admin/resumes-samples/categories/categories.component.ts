import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { WebsiteService } from '../../../website/website.service';
import { ResumeSampleService } from '../resume-sample.service';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})

export class CategoriesComponent implements OnInit, OnDestroy {

  categories = [];
  //to save value when we click on edit button
  selected_category_id;
  selected_category_name;
  getCategoryData = false;   //to show loader
  makeBlur = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  update_category_form = new FormGroup({
    category_name: new FormControl('',Validators.required)
  })

  constructor(
    public ws: WebsiteService,
    public rs: ResumeSampleService,
    public toast:ToastrService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5
    };
    this.getCategory();
  }

  getCategory() {
    setTimeout(() => {
      this.dtTrigger.next();
    }, 1000)
    this.ws.get_Samples_Category().subscribe((res) => {
      if (res) {
        this.getCategoryData = true;
        this.categories = res.categorys;
      }
    })
  }
  getSelectedCategory(id, name) {
    this.selected_category_id = id;
    this.selected_category_name = name;
    this.makeBlur = true;
  }

  updateCategory() {
    this.closeModal();
    this.getCategoryData = false;
    let formData = new FormData;
    formData.append("id", this.selected_category_id);
    formData.append("name", this.update_category_form.value["category_name"]);
    this.rs.updateCategory(formData).subscribe((res) => {
      if (res) {
        this.getCategoryData = true;
        this.toast.success("Category Updated");
        this.getCategory();
      }
    })
  }
  deleteCategory(id) {
    this.getCategoryData = false;
    this.rs.deleteCategory(id).subscribe((res) => {
      if (res) {
        console.log(res);
        this.getCategory();
        this.toast.success("Category Deleted");
        this.getCategoryData = true;
      }
    })
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  closeModal() {
    this.makeBlur = false;
  }
}
