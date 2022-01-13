import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurWritersComponent } from './our-writers.component';

describe('OurWritersComponent', () => {
  let component: OurWritersComponent;
  let fixture: ComponentFixture<OurWritersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurWritersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurWritersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
