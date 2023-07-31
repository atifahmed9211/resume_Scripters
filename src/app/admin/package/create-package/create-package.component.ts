import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.scss']
})

export class CreatePackageComponent implements OnInit {

  public packageForm = this.fb.group({
    id: [null],
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: ['', [Validators.required]],
    services: ['', [Validators.required]],
    service_type: ['', [Validators.required]]
  });

  public services = [];
  public btnText = 'Submit';

  constructor(
    private fb: FormBuilder,
    private as: AdminService,
    private router: ActivatedRoute,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.getServices();
    let id = this.router.snapshot.paramMap.get("id");
    if (id) {
      this.getPackage(id);
    }
  }

  createPackage() {
    let pkg = this.packageForm.value;
    if (pkg.id) {
      /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
      let admintoken = localStorage.getItem("adminToken");
      //in case we delete token from browser(Application)
      if (admintoken != null) {
        this.as.updatePackage(pkg).subscribe((res) => {
          this.route.navigateByUrl("/admin/package/all");
        },
          (error) => {
            console.log(error);
          })
      } else {
        this.route.navigateByUrl('admin/login');
      }
    } else {
      /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */
      let admintoken = localStorage.getItem("adminToken");
      //in case we delete token from browser(Application)
      if (admintoken != null) {
        this.as.createPackage(pkg).subscribe((res) => {
          this.route.navigateByUrl("/admin/package/all");
        },
          (error) => {
            console.log(error);
          });
      }
      else {
        this.route.navigateByUrl('admin/login');
      }
    }
  }

  getPackage(id) {
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */ 
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.getPackageById(id).subscribe((res) => {
        let pkg = res.package;
        let servicesIds = [];
        pkg.services.forEach(element => {
          servicesIds.push(element.id);
        });
        this.packageForm.patchValue({
          id: pkg.id,
          title: pkg.title,
          description: pkg.description,
          price: pkg.price,
          services: servicesIds,
          service_type: pkg.service_types[0].name
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

  getServices() {
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */ 
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.getAllServices().subscribe((res) => {
        this.services = res.services;
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
