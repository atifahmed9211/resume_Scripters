import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRevisionComponent } from './user-revision.component';

describe('UserRevisionComponent', () => {
  let component: UserRevisionComponent;
  let fixture: ComponentFixture<UserRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRevisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
