import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { departmentIdGuard } from './department-id.guard';

describe('departmentIdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => departmentIdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
