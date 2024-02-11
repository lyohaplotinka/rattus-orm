import { TestBed } from '@angular/core/testing';

import { RattusOrmAngularRxjsService } from './rattus-orm-angular-rxjs.service';

describe('RattusOrmAngularRxjsService', () => {
  let service: RattusOrmAngularRxjsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RattusOrmAngularRxjsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
