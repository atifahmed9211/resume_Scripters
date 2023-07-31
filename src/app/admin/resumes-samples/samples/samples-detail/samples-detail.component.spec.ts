import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesDetailComponent } from './samples-detail.component';

describe('SamplesDetailComponent', () => {
  let component: SamplesDetailComponent;
  let fixture: ComponentFixture<SamplesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamplesDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
