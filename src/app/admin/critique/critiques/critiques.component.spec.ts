import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CritiquesComponent } from './critiques.component';

describe('CritiquesComponent', () => {
  let component: CritiquesComponent;
  let fixture: ComponentFixture<CritiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CritiquesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CritiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
