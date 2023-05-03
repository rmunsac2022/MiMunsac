import { TestBed } from '@angular/core/testing';

import { StService } from './st.service';

describe('StService', () => {
  let service: StService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
