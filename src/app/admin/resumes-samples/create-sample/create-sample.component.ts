import { Component, OnInit } from '@angular/core';
import { ResumeSampleService } from '../resume-sample.service';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import { WebsiteService } from '../../../website/website.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-sample',
  templateUrl: './create-sample.component.html',
  styleUrls: ['./create-sample.component.scss']
})

export class CreateSampleComponent implements OnInit {

  files: any = [];
  categories = [];
  sampleResponse = false;  //to show loader
  makeBlur = false;
  category_already_exist_error = false;

  category_form = new FormGroup({
    category_name: new FormControl('',Validators.required)
  })
  sampleForm = new FormGroup({
    category: new FormControl('',Validators.required),
    sample_name: new FormControl('',Validators.required)
  })

  constructor(
    private rs: ResumeSampleService,
    private ws: WebsiteService,
    private toast:ToastrService 
  ) { }

  ngOnInit(): void {
    this.getCategory();
  }
  addCategory() {
    let formData = new FormData;
    formData.append("name", this.category_form.value["category_name"])
    this.rs.addCategory(formData).subscribe((res) => {
      console.log(res);
      $('#exampleModal').hide();
      $(".modal-backdrop").hide();
      this.getCategory();
      this.category_already_exist_error=false;
      this.closeModal();
      this.toast.success("New Category Added");
    },
    (error)=>{
      if(error.error=="Category already exist")
      {
        this.category_already_exist_error=true;
      }
    }
    )
  }
  onFileChange(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
  }
  removeFile(index)
  {
    this.files.splice(index,1)
  }
  getCategory() {
    this.ws.get_Samples_Category().subscribe((res) => {
      this.categories = res.categorys;
    })
  }
  add_samples() {
    this.sampleResponse = true;
    let formdata = new FormData;
    for (let item of this.files) {
      formdata.append('files[]', item);
    }
    formdata.append("name", this.sampleForm.value['sample_name']);
    formdata.append("category", this.sampleForm.value["category"]);
    console.log(formdata.get("files"));
    this.rs.createSample(formdata).subscribe((res) => {
      if (res) {
        this.sampleResponse = false;
        this.sampleForm.reset();
        this.toast.success("New Sample Added");
      }
    })
  }
  openModal()
  {
    this.makeBlur=true;
  }
  closeModal()
  {
    this.makeBlur=false;
  }
  resetError()
  {
    this.category_already_exist_error=false;
  }
}
