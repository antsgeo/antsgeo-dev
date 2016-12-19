import { Injectable, Component, Output, EventEmitter, Input } from '@angular/core';

import { MenuComponent } from './menu/menu.component';
import { MapComponent } from './map/map.component';
import { SendService } from './send-service/send.service';
import { FormGroup } from '@angular/forms';

@Component({
  providers: [],
  selector: 'my-app',
  template: `
            <my-menu #menuComponent
                     (_sendFilteringArrayToComp)="mapComponent.takeFilteringArr($event)"
                     (_sendEventReloadMap)="mapComponent.reloadMap($event)"
                     (_changeCursorMap)="mapComponent.changeCursor($event)">
            </my-menu>
            <my-map #mapComponent
                    (eventMapComponent)="menuComponent.takeCoor($event)"
                    (_sendMarkersToFilter)="menuComponent.getMarkerForFilter($event)"
                    (_failedGetMarkers)="menuComponent.failedGetMarkers($event)">
            </my-map>
  `,
})

export class AppComponent {
  constructor () { }

  ngOnInit () {  }
}
