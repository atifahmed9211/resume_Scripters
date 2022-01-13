import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCheckModalComponent } from './login-check-modal.component';

describe('LoginCheckModalComponent', () => {
  let component: LoginCheckModalComponent;
  let fixture: ComponentFixture<LoginCheckModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginCheckModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCheckModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
