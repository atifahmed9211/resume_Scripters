import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeBarrasComponent } from './resume-barras.component';

describe('ResumeBarrasComponent', () => {
  let component: ResumeBarrasComponent;
  let fixture: ComponentFixture<ResumeBarrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeBarrasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeBarrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
