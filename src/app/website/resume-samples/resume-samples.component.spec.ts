import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeSamplesComponent } from './resume-samples.component';

describe('ResumeSamplesComponent', () => {
  let component: ResumeSamplesComponent;
  let fixture: ComponentFixture<ResumeSamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeSamplesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
