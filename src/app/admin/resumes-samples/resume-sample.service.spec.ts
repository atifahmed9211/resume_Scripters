import { TestBed } from '@angular/core/testing';

import { ResumeSampleService } from './resume-sample.service';

describe('ResumeSampleService', () => {
  let service: ResumeSampleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumeSampleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
