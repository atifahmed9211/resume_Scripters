import { TestBed } from '@angular/core/testing';

import { ResumesSamplesService } from './resumes-samples.service';

describe('ResumesSamplesService', () => {
  let service: ResumesSamplesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumesSamplesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
