import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerAdviceComponent } from './career-advice.component';

describe('CareerAdviceComponent', () => {
  let component: CareerAdviceComponent;
  let fixture: ComponentFixture<CareerAdviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareerAdviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
