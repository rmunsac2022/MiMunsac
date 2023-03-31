import { TestBed } from '@angular/core/testing';

import { PermissionRequestService } from './permission-request.service';

describe('PermissionRequestService', () => {
  let service: PermissionRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
