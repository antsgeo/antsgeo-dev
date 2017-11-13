/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MakeMarkerService } from './make-marker.service';

describe('MakeMarkerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MakeMarkerService]
    });
  });

  it('should ...', inject([MakeMarkerService], (service: MakeMarkerService) => {
    expect(service).toBeTruthy();
  }));
});
