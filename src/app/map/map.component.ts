import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MarkerService } from '../marker-service/marker.service';

declare var L: any;
declare var Clipboard: any;
declare var markersCluster: any;

@Component({
    providers: [MarkerService],
    selector: 'my-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})

export class MapComponent {
    constructor(private _markerService: MarkerService) {}

    @Output() eventMapComponent = new EventEmitter();
    @Output() _sendMarkersToFilter = new EventEmitter();
    @Output() _failedGetMarkers = new EventEmitter();

    arrayMarkers: any[] = []; // Start array markers
    globalDeclareVarForMapbox: any = L; // Global variable for mapbox
    globalMap: any = null; // Variable for mapbox
    markersCluster: any = new L.MarkerClusterGroup(); // Init cluster markers
    changeCursorVar: boolean; // The boolean which permits change cursor on the map
    markerArr: any[] = []; // Array markers
    executedForLink: boolean = true;
    loaderMap: boolean = true;
    dateForFooter: any = new Date().getFullYear();

    protected sendCoor(data) { // Sending coordinate for menu component
        this.eventMapComponent.emit(data);
    }

    protected reloadMap(val) { // Reload the map when added new marker
      this.getMarkerFunction();
    }

    protected changeCursor(data: boolean) { // Take value for changeCursorVar variable
      this.changeCursorVar = data;
    }

    protected takeFilteringArr(data) { // Gets filtering array and from nenu component
        if (data[0]) { // If filtering array have the markers, send his
            this.deleteLayerMap(data);
        } else { // Else send full array
            this.deleteLayerMap(this.arrayMarkers);
        }
    }

    private initMap() { // Init map
        let _this = this;

        const tokenForMap = 'pk.eyJ1IjoianNjb2RlciIsImEiOiJjaXE4Y2gweHIwM' +
            'DNuaHhuc3A5eWxkc25tIn0.Frbvg0IRwj__jG2Pz7-e5w'

        L.mapbox.accessToken = tokenForMap;
        this.globalMap = this.globalDeclareVarForMapbox.mapbox.map('map') //, 'mapbox.streets'
            .setView([20, 40], 2);

        this.getMarkerFunction();

        L.control.layers({
            'Streets': L.mapbox.tileLayer('mapbox.streets').addTo(_this.globalMap),
            'Satellite': L.mapbox.styleLayer('mapbox://styles/mapbox/satellite-streets-v9')
        }).addTo(_this.globalMap);

        this.globalMap.on('click', function(e) {
            _this.sendCoor(e.latlng);
        });
    }

    protected getMarkerFunction () {
      this.globalMap.removeLayer(this.markersCluster);
      this._markerService.getMarker() // Gets markers from service
          .subscribe(
            res => {
              this.createMarkers(res); this.arrayMarkers = res;
              this._sendMarkersToFilter.emit(res);
            },
            err => { // If severs with markers not answer, loading local json file
              this._markerService.getMarkerLocal().subscribe(
                res => {
                  this.createMarkers(res);
                  this.arrayMarkers = res;
                  this._sendMarkersToFilter.emit(res);
                  this._failedGetMarkers.emit(true);
                }
              )
            });
    }

    protected deleteLayerMap(data) {
        this.globalMap.removeLayer(this.markersCluster); // Delete the old array
        this.createMarkers(data); // Send data to create-markers function
    }

    protected openPopupLink(local) { // Function, which open the tag from the link
      let localLink = Number(local)
      if (localLink && typeof localLink === 'number' && localLink <= this.markerArr.length && localLink > -1) {
        let localMarker = this.markerArr[localLink];
        this.globalMap.setView(localMarker._latlng, 20)
        localMarker.openPopup();
      }
    }

    protected getDataFromLink () { // This function must called only once
      if (this.executedForLink) {
          this.executedForLink = false;
          if (window.location.search) { // Check, if link have the id for tag
            let locat = window.location.search;
            this.openPopupLink(locat.replace(/[\\=?]|id/g, ''))
          }
      }
    }

    protected createMarkers(markers) { // Function which create markers on the map
        this.markersCluster = new L.MarkerClusterGroup({
          spiderfyOnMaxZoom: true,
          maxClusterRadius: 70,
          disableClusteringAtZoom: 17
        });
        for (let i in markers) {
            let marker = L.marker([Number(markers[i].coordinateX), Number(markers[i].coordinateY)], {
                icon:
                L.divIcon({
                    className: 'lableClass',
                    html: `
                    <div class="labelClass_point">
                      <img src="../../assets/img/map-marker-2.png">
                    </div>
                    <div class="lableClass_label">
                      ${markers[i].name.split(' ')[0].slice(0, 1).toUpperCase() + '. ' + markers[i].name.split(' ')[1]}
                    </div>
                    `
                })
            });
            let customPopup = `
              <div class="labelClass_specie">
                ${markers[i].name}
              </div>
              <div class="labelClass_comment">
                ${markers[i].comment}
              </div>
              <hr class="labelClass_hr"/>
              <button class="ui basic button btn labelClass_copyLink" data-tooltip="https://antsgeo.github.io/?id=${i}"
              data-clipboard-text="https://antsgeo.github.io/?id=${i}" data-position="top center">
                <i class="icon copy"></i>
                Click for copy link tag
              </button>
              <hr class="labelClass_hr"/>
              <div class="labelClass_coor">
                ${markers[i].coordinateX}, ${markers[i].coordinateY}
              </div>
              <div class="labelClass_time">
                ${markers[i].time}
              </div>
              <div class="labelClass_clear"> </div>
            `
            marker.bindPopup(customPopup, {
                closeButton: false,
                minWidth: 290
            });
            this.markersCluster.addLayer(marker);
            this.markerArr.push(marker);
        }
        this.globalMap.addLayer(this.markersCluster);
        this.getDataFromLink();
        this.loaderMap = false;
    }

    ngOnInit() { // function init
        this.initMap();
        new Clipboard('.btn');
    }
}
