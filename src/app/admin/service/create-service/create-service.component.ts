import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss']
})

export class CreateServiceComponent implements OnInit {

  public serviceForm = this.fb.group({
    id: [null],
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: ['', [Validators.required]],
    service_type: ['', [Validators.required]]
  });

  public btnText = 'Submit';

  constructor(
    private fb: FormBuilder,
    private as: AdminService,
    private router: ActivatedRoute,
    private route: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    let id = this.router.snapshot.paramMap.get("id");
    if (id) {
      this.getService(id);
    }
  }

  createService() {
    let service = this.serviceForm.value;
    if (service.id) {
      /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
      let admintoken = localStorage.getItem("adminToken");
      //in case we delete token from browser(Application)
      if (admintoken != null) {
        this.as.updateService(service).subscribe((res) => {
          this.toastr.success('Service Updated Successfully', 'Success');
          this.route.navigateByUrl("/admin/service/all");
        },
          (error) => {
            console.log(error);
          })
      }
      else {
        this.route.navigateByUrl('admin/login');
      }
    } else {
      /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
      let admintoken = localStorage.getItem("adminToken");
      //in case we delete token from browser(Application)
      if (admintoken != null) {
        this.as.createService(service).subscribe((res) => {
          this.toastr.success('Service Created Successfully', 'Success');
          this.route.navigateByUrl("/admin/service/all");
        },
          (error) => {
            console.log(error);
          });
      } else {
        this.route.navigateByUrl('admin/login');
      }
    }
  }

  getService(id) {
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */ 
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.getServiceById(id).subscribe((res) => {
        let service = res.service;
        this.serviceForm.patchValue({
          id: service.id,
          title: service.title,
          description: service.description,
          price: service.price,
          service_type: service.service_types[0].name
        });
        this.btnText = "Update";
      },
        (error) => {
          console.log(error);
        })
    }
    else {
      this.route.navigateByUrl('admin/login');
    }
  }
}
