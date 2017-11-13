import { Injectable, Component, Output, EventEmitter, Input } from '@angular/core';

import { MenuComponent } from './menu/menu.component';
import { MapComponent } from './map/map.component';
import { SendService } from './send-service/send.service';
import { MarkerService } from './marker-service/marker.service';
import { MakeMarkerService } from './make-marker/make-marker.service';
import { FormGroup } from '@angular/forms';
import { Auth } from './auth-service/auth.service';
import { ComplainService } from './complain-service/complain.service';
import { TranslateService } from './translate-service/translate.service';
import { ValidateService } from './validate-service/validate.service';
import 'rxjs/add/operator/map';

@Component({
  providers: [Auth, MakeMarkerService, ComplainService, TranslateService, ValidateService],
  selector: 'my-app',
  template: `
            <my-menu #menuComponent
                     (_sendFilteringArrayToComp)="mapComponent.takeFilteringArr($event)"
                     (_sendEventReloadMap)="mapComponent.reloadMap($event)"
                     (_changeCursorMap)="mapComponent.changeCursor($event)"
                     (_sendUserMarker)="mapComponent.takeUserMarker($event)"
                     (_resetUserMarkers)="mapComponent.resettingUSerMarkers($event)"
                     (_openUserMarker)="mapComponent.openPopupLink($event)">
            </my-menu>
            <my-map #mapComponent
                    (eventMapComponent)="menuComponent.takeCoor($event)"
                    (_sendMarkersToFilter)="menuComponent.getMarkerForFilter($event)"
                    (_failedGetMarkers)="menuComponent.failedGetMarkers($event)"
                    (_openAccount)="menuComponent.openAccount($event)"
                    (_handlingError)="menuComponent.handlingError($event)">
            </my-map>
  `,
})

export class AppComponent {
  constructor (private auth0: Auth) {
    this.auth0.handleAuthentication();
  }

  ngOnInit () { }
}
