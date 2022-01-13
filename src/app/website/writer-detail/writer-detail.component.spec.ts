import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriterDetailComponent } from './writer-detail.component';

describe('WriterDetailComponent', () => {
  let component: WriterDetailComponent;
  let fixture: ComponentFixture<WriterDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriterDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
