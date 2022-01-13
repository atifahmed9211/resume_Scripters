import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FederalServicesComponent } from './federal-services.component';

describe('FederalServicesComponent', () => {
  let component: FederalServicesComponent;
  let fixture: ComponentFixture<FederalServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FederalServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FederalServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
