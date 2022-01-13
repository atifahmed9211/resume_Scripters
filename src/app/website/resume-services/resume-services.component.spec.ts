import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeServicesComponent } from './resume-services.component';

describe('ResumeServicesComponent', () => {
  let component: ResumeServicesComponent;
  let fixture: ComponentFixture<ResumeServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
