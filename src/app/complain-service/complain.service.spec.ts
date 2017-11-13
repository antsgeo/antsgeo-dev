/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ComplainService } from './complain.service';

describe('ComplainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComplainService]
    });
  });

  it('should ...', inject([ComplainService], (service: ComplainService) => {
    expect(service).toBeTruthy();
  }));
});
