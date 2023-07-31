import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validator, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserService } from '../../../user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume-data',
  templateUrl: './resume-data.component.html',
  styleUrls: ['./resume-data.component.scss']
})

export class ResumeDataComponent implements OnInit {

  public cvForm = this.fb.group({
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: [''],
    phoneNumber: ['', Validators.required],
    email: ['', Validators.required],
    linkdin_url: [''],
    address: ['', Validators.required],
    languages: this.fb.array([]),
    computer_skill: [''],
    interpersonal_skill: [''],
    positions: this.fb.array([]),
    expertise1: [''],
    expertise2: [''],
    academic_degrees: this.fb.array([]),
    certifications: this.fb.array([]),
    memberships: this.fb.array([]),
    experience: this.fb.array([]),
  })

  orderId;
  //to enable or disable plus button
  lastIndexLanguageValue;
  lastIndexPositionValue;
  lastIndexAcademicValue;
  lastIndexCertificateValue;
  lastIndexMembershipValue;
  lastIndexExperienceValue;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private us: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.addLanguage();
    this.addPositions();
    this.addDegrees();
    this.addCertificate();
    this.addMembership();
    this.addExperience();
    this.orderId = this.route.snapshot.paramMap.get('id');
  }
  
  addLanguage() {
    this.lastIndexLanguageValue = false;
    const language = this.fb.group({
      language_name: [''],
      proficiency_level: [''],
    });

    this.languages.push(language);
  }

  RemoveLanguage() {
    this.languages.removeAt(this.languages.length - 1);
  }

  addPositions() {
    this.lastIndexPositionValue = false;
    const position = this.fb.group({
      country_targeted: [''],
      position_title: [''],
      description: [''],
      position_link: [''],
      salary: ['']
    });

    this.positions.push(position);
  }

  RemovePositions() {
    this.positions.removeAt(this.positions.length - 1);
  }

  addDegrees() {
    this.lastIndexAcademicValue = false;
    const degree = this.fb.group({
      name_of_institute: [''],
      name_of_degree: [''],
      state: [''],
      city: [''],
      starting_date: [''],
      ending_date: ['']
    });

    this.academic_degrees.push(degree);
  }

  RemoveDegrees() {
    this.academic_degrees.removeAt(this.academic_degrees.length - 1);
  }

  addCertificate() {
    this.lastIndexCertificateValue = false;
    const certificate = this.fb.group({
      name_of_institute: [''],
      name_of_course: [''],
      state: [''],
      city: [''],
      starting_date: [''],
      ending_date: ['']
    });

    this.certifications.push(certificate);
  }

  RemoveCertificate() {
    this.certifications.removeAt(this.certifications.length - 1);
  }

  addMembership() {
    this.lastIndexMembershipValue = false;
    const membership = this.fb.group({
      name_of_institute: [''],
      explanation: [''],
      state: [''],
      city: [''],
      starting_date: [''],
      ending_date: ['']
    });

    this.memberships.push(membership);
  }

  RemoveMembership() {
    this.memberships.removeAt(this.memberships.length - 1);
  }

  addExperience() {
    this.lastIndexExperienceValue = false;
    const experience = this.fb.group({
      name_of_institute: [''],
      position: [''],
      starting_date: [''],
      ending_date: [''],
      state: [''],
      city: [''],
      duties: [''],
      achievements: ['']
    });

    this.experience.push(experience);
  }

  RemoveExperience() {
    this.experience.removeAt(this.experience.length);
  }

  get languages() {
    return this.cvForm.controls["languages"] as FormArray
  }

  get positions() {
    return this.cvForm.controls["positions"] as FormArray
  }

  get academic_degrees() {
    return this.cvForm.controls["academic_degrees"] as FormArray
  }

  get certifications() {
    return this.cvForm.controls["certifications"] as FormArray
  }

  get memberships() {
    return this.cvForm.controls["memberships"] as FormArray
  }

  get experience() {
    return this.cvForm.controls["experience"] as FormArray
  }

  submitCVForm() {
    this.us.chooseCV = false;
    let order = {
      id: this.orderId,
      resume_details: this.cvForm.value
    };
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */ 
    let usertoken = localStorage.getItem("userToken");
    //in case we delete token from browser(Application)
    if (usertoken != null) {
      this.us.submitResumeData(order).subscribe((res) => {
        console.log();
      })
    }
    else {
      this.router.navigateByUrl('login');
    }
    this.location.back();
  }

  getLanguageName(i) {
    if (this.languages.at(i).value.language_name) {
      this.lastIndexLanguageValue = true;
    }
    else {
      this.lastIndexLanguageValue = false;
    }
  }

  getPositionValue(i) {
    if (this.positions.at(i).value.country_targeted || this.positions.at(i).value.position_title || this.positions.at(i).value.description || this.positions.at(i).value.position_link || this.positions.at(i).value.salary) {
      this.lastIndexPositionValue = true;
    }
    else {
      this.lastIndexPositionValue = false;
    }
  }

  getAcademicValue(i) {
    if (this.academic_degrees.at(i).value.name_of_institute || this.academic_degrees.at(i).value.name_of_degree) {
      this.lastIndexAcademicValue = true;
    }
    else {
      this.lastIndexAcademicValue = false;
    }
  }

  getCertificateValue(i) {
    if (this.certifications.at(i).value.name_of_institute || this.certifications.at(i).value.name_of_course) {
      this.lastIndexCertificateValue = true;
    }
    else {
      this.lastIndexCertificateValue = false;
    }
  }

  getMembershipValue(i) {
    if (this.memberships.at(i).value.name_of_institute || this.memberships.at(i).value.explanation) {
      this.lastIndexMembershipValue = true;
    }
    else {
      this.lastIndexMembershipValue = false;
    }
  }

  getExperienceValue(i) {
    if (this.experience.at(i).value.name_of_institute || this.experience.at(i).value.position || this.experience.at(i).value.duties || this.experience.at(i).value.achievements) {
      this.lastIndexExperienceValue = true;
    }
    else {
      this.lastIndexExperienceValue = false;
    }
  }
  
  //to enable or disable negative button
}