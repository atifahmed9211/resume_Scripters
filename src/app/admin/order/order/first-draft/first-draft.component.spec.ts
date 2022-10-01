import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstDraftComponent } from './first-draft.component';

describe('FirstDraftComponent', () => {
  let component: FirstDraftComponent;
  let fixture: ComponentFixture<FirstDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstDraftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
