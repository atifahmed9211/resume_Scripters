import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin.service';
import { environment } from '../../../../environments/environment';
import { FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-critique',
  templateUrl: './critique.component.html',
  styleUrls: ['./critique.component.scss']
})

export class CritiqueComponent implements OnInit {

  public critiqueForm = this.fb.group({
    id: [''],
    brevityValue: [''],
    brevityDescription: [''],
    impactValue: [''],
    impactDescription: [''],
    depthValue: [''],
    depthDescription: [''],
    noOfPages: [''],
    pagesDescription: [''],
    wordCount: [''],
    wordDescription: [''],
    fileSize: [''],
    fileDescription: [''],
    email: [''],
    phone: [''],
    linkedin: [''],
    address: [''],
    industries: this.fb.array([

    ]),
    grammarFlow: this.fb.array([

    ]),
    visualPresenatation: this.fb.array([

    ])
  });

  public critique = null;
  public mediaUrl = environment.mediaUrl;

  constructor(
    private route: ActivatedRoute,
    private as: AdminService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getCritique();
  }

  get industries() {
    return this.critiqueForm.controls["industries"] as FormArray;
  }

  get grammarFlow() {
    return this.critiqueForm.controls["grammarFlow"] as FormArray;
  }

  get visualPresenatation() {
    return this.critiqueForm.controls["visualPresenatation"] as FormArray;
  }

  addIndustries() {
    const industries = this.fb.group({
      name: [''],
      value: [''],
    });

    this.industries.push(industries);
  }

  addGrammarFlow() {
    const grammarFlow = this.fb.group({
      title: [''],
      description: [''],
      status: ['']
    });

    this.grammarFlow.push(grammarFlow);
  }

  addVisualPresenatation() {
    const visualPresenatation = this.fb.group({
      title: [''],
      description: [''],
      status: ['']
    });

    this.visualPresenatation.push(visualPresenatation);
  }

  getCritique() {
    let id = this.route.snapshot.paramMap.get("id");
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */ 
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
      this.as.getCritiqueById(id).subscribe((res) => {
        this.critique = res.critique;
        this.critiqueForm.patchValue({
          id: this.critique.id,
          brevityValue: this.critique.brevity,
          brevityDescription: this.critique.brevity_description,
          impactValue: this.critique.impact,
          impactDescription: this.critique.impact_description,
          depthValue: this.critique.depth,
          depthDescription: this.critique.depth_description,
          noOfPages: this.critique.pages,
          pagesDescription: this.critique.pages_description,
          wordCount: this.critique.word_count,
          wordDescription: this.critique.word_count_description,
          fileSize: this.critique.file_size,
          fileDescription: this.critique.file_size_description,
          email: this.critique.mail,
          phone: this.critique.phone,
          linkedin: this.critique.linkedin,
          address: this.critique.address
        });
        this.critique.critique_grammar_comments.forEach(element => {
          const grammarFlow = this.fb.group({
            title: [element.title],
            description: [element.description],
            status: [element.status]
          });
          this.grammarFlow.push(grammarFlow);
        });
        this.critique.critique_presentation_comments.forEach(element => {
          const visualPresenatation = this.fb.group({
            title: [element.title],
            description: [element.description],
            status: [element.status]
          });
          this.visualPresenatation.push(visualPresenatation);
        });
        this.critique.critique_industries.forEach(element => {
          const industries = this.fb.group({
            name: [element.name],
            value: [element.value],
          });
          this.industries.push(industries);
        });
      },
        (error) => {
          console.log(error)
        });
    }
    else {
      this.router.navigateByUrl('admin/login');
    }
  }

  updateCritique() {
    let critique = this.critiqueForm.value;
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */ 
    let admintoken = localStorage.getItem("adminToken");
    //in case we delete token from browser(Application)
    if (admintoken != null) {
    this.as.updateCritique(critique).subscribe((res) => {
    },
      (error) => {
        console.log(error);
      })
    }
    else {
      this.router.navigateByUrl('admin/login');
    }
  }
}
